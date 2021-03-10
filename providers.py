import re
from glob import glob
import subprocess
from itertools import islice
from math import log as logarithm


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


def check_output(command, stderr=False):
    return subprocess.run(
        command,
        stdout=subprocess.PIPE,
        stderr=(subprocess.STDOUT if stderr else None),
        shell=(type(command) == str),
        universal_newlines=True,
        check=False,
    ).stdout


def get_sector_sizes():
    sector_sizes = {}
    for file in glob("/sys/block/*/queue/hw_sector_size"):
        try:
            with open(file) as f:
                sector_sizes[file.split("/")[3]] = int(f.read().strip())
        except OSError:
            continue
    return sector_sizes


n_cpus = int(check_output('getconf _NPROCESSORS_ONLN'))
cpu_ticks = int(check_output('getconf CLK_TCK'))
sector_sizes = get_sector_sizes()


def disk():
    result = []
    for line in get_file_content('/proc/diskstats'):
        if len(line) >= 14 and not line[2].startswith('loop'):
            multiplier = sector_sizes.get(line[2], 512)
            result.append((line[2], int(line[5]) * multiplier, int(line[9]) * multiplier))
    return result


def get_file_content(filename):
    try:
        with open(filename) as f:
            content = f.read()
    except OSError:
        return
    for line in content.strip().split('\n'):
        yield line.split()


def cpu():
    result = []
    for line in get_file_content('/proc/stat'):
        if line[0].startswith('cpu'):
            result.append(
                (line[0], (int(line[1]) + int(line[2])) / cpu_ticks, int(line[3]) / cpu_ticks)
            )
    return result


def net():
    result = []
    for line in islice(get_file_content('/proc/net/dev'), 2, None):
        name = line[0]
        result.append((line[0], int(line[1]), int(line[9])))
    return result


def memory():
    content = {line[0]: int(line[1]) * 1024 for line in get_file_content('/proc/meminfo')}
    total = content['MemTotal:']
    secondary = content['Buffers:'] + content['Cached:']
    primary = total - content['MemFree:'] - secondary
    return [
        (
            f'memory {convert_size_2(primary + secondary)}/{convert_size_2(total)}',
            primary / total,
            secondary / total,
        )
    ]


def zpool():
    # sudo zpool list -H -o name,comment,alloc,size,health,failmode
    return []
