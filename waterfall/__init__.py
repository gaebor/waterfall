from re import search
from termcolor import colored


def parse_column_descriptors(argv, default_width):
    column_descriptors = {}
    i = 0
    while i < len(argv):
        pattern = argv[i]
        i += 1
        column_descriptors[pattern] = {'factor': 100, 'width': default_width}
        try:
            value = float(argv[i])
        except ValueError:
            pass
        except IndexError:
            pass
        else:
            column_descriptors[pattern]['factor'] = value
            i += 1

        try:
            value = int(argv[i])
        except ValueError:
            pass
        except IndexError:
            pass
        else:
            column_descriptors[pattern]['width'] = value
            i += 1

    return column_descriptors


def print_line(message, descriptors):
    printed = False
    for pattern, description in descriptors.items():
        relevant_messages = filter(lambda values: search(pattern, values[0]) is not None, message)
        for values in relevant_messages:
            printed = True
            text = values[0]
            if len(values) > 3:
                text = values[3]
            factor = description['width'] / description['factor']
            print(
                render_bars(
                    text,
                    int(round(factor * values[1])),
                    int(round(factor * values[2])),
                    width=description['width'],
                    additive=values[4] if len(values) > 4 else True,
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


def text_cap(s, width):
    if width == 0:
        return ''
    return f'{s[:width]:{width}s}'
