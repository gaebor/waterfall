dir
python -m pip install .
python -m waterfall -h
python -m waterfall -n 2

python -m pip install .[webserver]

start /b python -m waterfall.server
python -m waterfall.client
