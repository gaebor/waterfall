from itertools import chain
from math import log as logarithm
from time import time

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
            if result[0] in self.previous:
                previous = self.previous[result[0]]
                derived_values.append(
                    (
                        result[0],
                        (result[1] - previous[1]) / time_diff,
                        (result[2] - previous[2]) / time_diff,
                    )
                    + result[3:]
                )
            self.previous[result[0]] = result
        self.time = current_time
        return derived_values


@time_diff
def disk():
    for disk_name, disk_io in psutil.disk_io_counters(perdisk=True).items():
        yield disk_name, disk_io.read_bytes / 1250000, disk_io.write_bytes / 1250000, '', False


def cpu():
    cpu_times = psutil.cpu_times_percent(percpu=True)
    frequencies = psutil.cpu_freq(percpu=True)

    padding = int(logarithm(len(cpu_times), 10)) + 1

    cpu_infos = [
        [f'cpu{i:0{padding}d}', cpu_time.user, cpu_time.system, '', True]
        for i, cpu_time in enumerate(cpu_times)
    ]
    cpu_infos.append(
        [
            'cpu',
            sum(x[1] for x in cpu_infos) / len(cpu_infos),
            sum(x[2] for x in cpu_infos) / len(cpu_infos),
            '',
            True,
        ]
    )

    if len(frequencies) == 1:
        cpu_infos[-1][-2] = str(frequencies[0].current) + 'MHz'
    elif len(frequencies) == len(cpu_infos) - 1:
        for i in range(len(frequencies)):
            cpu_infos[i][-2] = str(frequencies[i].current) + 'MHz'
    return cpu_infos


@time_diff
def net():
    for nic_name, nic_io in psutil.net_io_counters(pernic=True).items():
        yield nic_name, nic_io.bytes_recv / 1250000, nic_io.bytes_sent / 1250000, '', False


def memory():
    mem_usage = psutil.virtual_memory()
    total = mem_usage.total
    return [
        (
            'memory',
            mem_usage.percent,
            0,
            f'{convert_size_2(mem_usage.percent * total / 100)}B / {convert_size_2(total)}B',
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

            yield (f'gpu{i:0{padding}d}', gpu_percent, 0, f'{name} ({i})')
            yield (
                f'gpu{i:0{padding}d} memory',
                memory_percent,
                0,
                f'{convert_size_2(memory_percent * total_memory / 100)}B / {convert_size_2(total_memory)}B',
            )
        nvmlShutdown()

    def all():
        return list(chain(cpu(), memory(), disk(), net(), gpu()))
