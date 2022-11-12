from itertools import chain
from math import log as logarithm
from time import time
import dataclasses

import psutil


def convert_size(size_bytes, table, base):
    if len(table) == 0 or base <= 0:
        raise ValueError("ERROR in convert_size")
    if size_bytes == 0:
        return "0" + table[0]
    i = min(int(logarithm(size_bytes, base)), len(table) - 1)
    p = base**i
    s = round(size_bytes / p, 2)
    return "{:g}{:s}".format(s, table[i])


def convert_size_2(bytes):
    return convert_size(bytes, ("", "Ki", "Mi", "Gi", "Ti", "Pi", "Ei", "Zi", "Yi"), 1024)


def convert_size_10(size):
    return convert_size(size, ("", "k", "M", "G", "T", "P", "E", "Z", "Y"), 1000)


@dataclasses.dataclass
class Metric:
    name: str
    primary_resource: float
    theoretical_maximum: float
    secondary_resource: float = 0.0
    alternative_display: str = None
    additive: bool = True


class time_diff:
    def __init__(self, f):
        self.f = f
        self.time = time()
        self.previous = {}

    def __call__(self):
        results = self.f()
        derived_values = []
        current_time = time()
        time_diff = current_time - self.time
        for result in results:
            if result.name in self.previous:
                previous = self.previous[result.name]
                derived_values.append(
                    dataclasses.replace(
                        result,
                        primary_resource=(result.primary_resource - previous.primary_resource)
                        / time_diff,
                        secondary_resource=(
                            result.secondary_resource - previous.secondary_resource
                        )
                        / time_diff,
                    )
                )
            self.previous[result.name] = result
        self.time = current_time
        return derived_values


@time_diff
def disk():
    for disk_name, disk_io in psutil.disk_io_counters(perdisk=True).items():
        yield Metric(
            disk_name,
            disk_io.read_bytes,
            theoretical_maximum=125000000,
            secondary_resource=disk_io.write_bytes,
            additive=False,
        )


def cpu():
    cpu_times = psutil.cpu_times_percent(percpu=True)
    frequencies = psutil.cpu_freq(percpu=True)

    padding = int(logarithm(len(cpu_times), 10)) + 1

    cpu_infos = [
        Metric(
            f'cpu{i:0{padding}d}',
            cpu_time.user,
            theoretical_maximum=100,
            secondary_resource=cpu_time.system,
        )
        for i, cpu_time in enumerate(cpu_times)
    ]
    cpu_infos.append(
        Metric(
            'cpu',
            sum(x.primary_resource for x in cpu_infos),
            theoretical_maximum=len(cpu_infos) * 100,
            secondary_resource=sum(x.secondary_resource for x in cpu_infos),
        )
    )

    if len(frequencies) == 1:
        cpu_infos[-1].alternative_display = str(frequencies[0].current) + 'MHz'
    elif len(frequencies) == len(cpu_infos) - 1:
        for i in range(len(frequencies)):
            cpu_infos[i].alternative_display = str(frequencies[i].current) + 'MHz'
    return cpu_infos


@time_diff
def net():
    for nic_name, nic_io in psutil.net_io_counters(pernic=True).items():
        yield Metric(
            nic_name,
            nic_io.bytes_recv,
            theoretical_maximum=125000000,
            secondary_resource=nic_io.bytes_sent,
            additive=False,
        )


def memory():
    mem_usage = psutil.virtual_memory()
    total = mem_usage.total
    return [
        Metric(
            'memory',
            mem_usage.percent,
            theoretical_maximum=100,
            alternative_display=(
                f'{convert_size_2(mem_usage.percent * total / 100)}B'
                f' / {convert_size_2(total)}B'
            ),
        )
    ]


try:
    from pynvml.nvml import *
except ModuleNotFoundError:

    def all():
        return list(chain(cpu(), memory(), disk(), net()))

else:

    def gpu():
        nvmlInit()
        num_devices = nvmlDeviceGetCount()
        if num_devices > 0:
            padding = int(logarithm(num_devices, 10)) + 1
        for i in range(num_devices):
            handle = nvmlDeviceGetHandleByIndex(i)
            name = nvmlDeviceGetName(handle).decode("ascii")
            total_memory = nvmlDeviceGetMemoryInfo(handle).total
            utilization = nvmlDeviceGetUtilizationRates(handle)
            gpu_percent, memory_percent = utilization.gpu, utilization.memory

            yield Metric(
                f'gpu{i:0{padding}d}',
                gpu_percent,
                theoretical_maximum=100,
                alternative_display=f'{name} ({i})',
            )
            yield Metric(
                f'gpu{i:0{padding}d} memory',
                memory_percent,
                theoretical_maximum=100,
                alternative_display=(
                    f'{convert_size_2(memory_percent * total_memory / 100)}B'
                    f' / {convert_size_2(total_memory)}B'
                ),
            )
        nvmlShutdown()

    def all():
        return list(chain(cpu(), memory(), disk(), net(), gpu()))
