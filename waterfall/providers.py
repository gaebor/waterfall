from itertools import chain
from math import log as logarithm
from time import time
import dataclasses

import psutil

from waterfall import Metric


def convert_size(size_bytes, table, base):
    if len(table) == 0 or base <= 0:
        raise ValueError("ERROR in convert_size")
    if size_bytes == 0:
        return "0" + table[0]
    i = min(int(logarithm(size_bytes, base)), len(table) - 1)
    return f"{round(size_bytes / base**i, 2):g}{table[i]:s}"


def convert_size_2(size):
    return convert_size(size, ("", "Ki", "Mi", "Gi", "Ti", "Pi", "Ei", "Zi", "Yi"), 1024)


def convert_size_10(size):
    return convert_size(size, ("", "k", "M", "G", "T", "P", "E", "Z", "Y"), 1000)


# pylint: disable=too-few-public-methods
class TimeDiff:
    def __init__(self, provider):
        self.provider = provider
        self.time = time()
        self.previous = {}

    def __call__(self):
        metrics = self.provider()
        derived_values = []
        current_time = time()
        time_diff = current_time - self.time
        for metric in metrics:
            if metric.name in self.previous:
                previous = self.previous[metric.name]
                derived_values.append(
                    dataclasses.replace(
                        metric,
                        primary_resource=(metric.primary_resource - previous.primary_resource)
                        / time_diff,
                        secondary_resource=(
                            metric.secondary_resource - previous.secondary_resource
                        )
                        / time_diff,
                    )
                )
            self.previous[metric.name] = metric
        self.time = current_time
        return derived_values


@TimeDiff
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
        for cpu_info, frequency in zip(cpu_infos, frequencies):
            cpu_info.alternative_display = str(frequency.current) + 'MHz'
    return cpu_infos


@TimeDiff
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


def gpu():
    nvmlInit()
    num_devices = nvmlDeviceGetCount()
    if num_devices > 0:
        padding = int(logarithm(num_devices, 10)) + 1
    for i in range(num_devices):
        handle = nvmlDeviceGetHandleByIndex(i)
        name = nvmlDeviceGetName(handle)
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


try:
    from pynvml import (
        nvmlInit,
        nvmlDeviceGetCount,
        nvmlDeviceGetHandleByIndex,
        nvmlDeviceGetName,
        nvmlDeviceGetMemoryInfo,
        nvmlDeviceGetUtilizationRates,
        nvmlShutdown,
    )
except ModuleNotFoundError:

    def every():
        return list(chain(cpu(), memory(), disk(), net()))

else:

    def every():
        return list(chain(cpu(), memory(), disk(), net(), gpu()))
