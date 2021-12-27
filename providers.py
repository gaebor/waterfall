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
    p = base ** i
    s = round(size_bytes / p, 2)
    return "{:g}{:s}".format(s, table[i])


def convert_size_2(bytes):
    return convert_size(bytes, ("", "Ki", "Mi", "Gi", "Ti", "Pi", "Ei", "Zi", "Yi"), 1024)


def convert_size_10(size):
    return convert_size(size, ("", "k", "M", "G", "T", "P", "E", "Z", "Y"), 1000)


def time_diff(f):
    class derivator:
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

    return derivator(f)


@time_diff
def disk():
    return [
        (disk_name, disk_io.read_bytes, disk_io.write_bytes)
        for disk_name, disk_io in psutil.disk_io_counters(perdisk=True).items()
    ]


def cpu():
    cpu_times = psutil.cpu_times_percent(percpu=True)
    padding = int(logarithm(len(cpu_times), 10)) + 1

    frequencies = psutil.cpu_freq(percpu=True)
    if len(frequencies) == 1:
        frequencies = frequencies * len(cpu_times)

    cpu_infos = [
        (f'cpu{i:0{padding}d}', cpu_time.user, cpu_time.system, str(cpu_freq.current) + 'MHz')
        for i, (cpu_time, cpu_freq) in enumerate(zip(cpu_times, frequencies))
    ]
    cpu_infos.append(('cpu', sum(x[1] for x in cpu_infos), sum(x[2] for x in cpu_infos)))
    return cpu_infos


@time_diff
def net():
    return [
        (nic_name, nic_io.bytes_recv, nic_io.bytes_sent)
        for nic_name, nic_io in psutil.net_io_counters(pernic=True).items()
    ]


def memory():
    mem_usage = psutil.virtual_memory()
    return [('memory', mem_usage.percent, 0, convert_size_2(mem_usage.total) + 'B')]


def zpool():
    # sudo zpool list -H -o name,comment,alloc,size,health,failmode
    return []


def all():
    return list(chain(cpu(), memory(), disk(), net()))
