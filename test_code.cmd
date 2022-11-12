python -m pip install .

python -m waterfall -h
python -m waterfall -n 2

python -m pip install pynvml
python -m waterfall -n 2

python -m pip install .[webserver]
python -m waterfall.client -h
python -m waterfall.server -h
