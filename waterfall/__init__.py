from typing import List, Dict, Iterable
from re import search
from dataclasses import dataclass
from argparse import ArgumentParser

from termcolor import colored

from waterfall.providers import Metric


@dataclass
class Descriptor:
    pattern: str
    width: int
    factor: int = None


def parse_column_descriptors(argv, default_width) -> Dict[str, Descriptor]:
    column_descriptors = {}
    i = 0
    while i < len(argv):
        pattern = argv[i]
        i += 1
        column_descriptors[pattern] = Descriptor(pattern, default_width)
        try:
            value = float(argv[i])
        except ValueError:
            pass
        except IndexError:
            pass
        else:
            column_descriptors[pattern].factor = value
            i += 1

        try:
            value = int(argv[i])
        except ValueError:
            pass
        except IndexError:
            pass
        else:
            column_descriptors[pattern].width = value
            i += 1

    return list(column_descriptors.values())


def add_descriptor_arguments(parser: ArgumentParser):
    parser.add_argument(
        '--descriptors',
        nargs="*",
        type=str,
        default=['.*'],
        help='a DESCRIPTOR is such: `pattern [factor [width]]` where `pattern` is a regex, '
        '`factor` is a float and `width` is an integer',
    )


def print_line(messages: List[Metric], descriptors: Iterable[Descriptor]):
    printed = False
    for descriptor in descriptors:
        relevant_messages = [
            metric for metric in messages if search(descriptor.pattern, metric.name)
        ]
        for metric in relevant_messages:
            printed = True
            text = (
                metric.name if metric.alternative_display is None else metric.alternative_display
            )
            factor = descriptor.width / (
                descriptor.factor if descriptor.factor else metric.theoretical_maximum
            )
            print(
                render_bars(
                    text,
                    int(round(factor * metric.primary_resource)),
                    int(round(factor * metric.secondary_resource)),
                    width=descriptor.width,
                    additive=metric.additive,
                ),
                end='',
            )
    if printed:
        print('', flush=True)


def render_bars(
    text: str,
    highlight1_width: int,
    highlight2_width: int = 0,
    width: int = 80,
    additive: bool = True,
):
    if additive:
        attributes = [
            (highlight1_width, {'attrs': ['reverse']}),
            (highlight2_width, {'on_color': 'on_red'}),
        ]
    else:
        first_width = min(highlight1_width, highlight2_width)
        second_width = max(highlight1_width, highlight2_width)
        attributes = [
            (first_width, {'on_color': 'on_magenta'}),
            (
                second_width,
                (
                    {'on_color': 'on_red'}
                    if highlight2_width > highlight1_width
                    else {'attrs': ['reverse']}
                ),
            ),
        ]
    return render_with_colors(text, attributes, width)


def render_with_colors(text: str, attributes, width: int):
    text = text_cap(text, width)
    result = ''
    printed = 0
    for length, attribute in attributes:
        if length > 0:
            result += colored(text[printed : printed + length], **attribute)
        printed += length
        if printed > width:
            break
    result += text[printed:]
    return result


def text_cap(string, width):
    if width == 0:
        return ''
    return f'{string[:width]:{width}s}'
