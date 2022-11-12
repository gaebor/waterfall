from argparse import ArgumentParser, ArgumentDefaultsHelpFormatter
from time import sleep

from waterfall import providers, parse_column_descriptors, print_line


def main():
    args = get_args()
    counter = 0
    while counter < args.n or args.n == 0:
        print_line(providers.every(), args.descriptors)
        sleep(args.refresh)
        counter += 1


def get_args():
    parser = ArgumentParser(formatter_class=ArgumentDefaultsHelpFormatter)
    parser.add_argument('--width', default=20, help=' ', type=int)
    parser.add_argument(
        '-n',
        default=0,
        type=int,
        help='specifies the number of iterations to take. ' 'If 0 then runs in an infinite loop',
    )
    parser.add_argument('--refresh', default=2, help='seconds', type=int)
    parser.add_argument(
        '--descriptors',
        nargs="*",
        type=str,
        default=['.*'],
        help='pattern [factor [width]] [pattern [factor [width]]] ... where `pattern` is a regex, '
        '`factor` is an float and `width` is an integer',
    )
    args = parser.parse_args()
    args.descriptors = parse_column_descriptors(args.descriptors, args.width)
    return args


if __name__ == '__main__':
    main()
