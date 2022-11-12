set -e
python -m pip install .
python -m waterfall -h
python -m waterfall -n 2

python -m pip install .[webserver]

python -m waterfall.server -h
python -m waterfall.client -h

timeout 20 python -m waterfall.server &
timeout 10 python -m waterfall.client
