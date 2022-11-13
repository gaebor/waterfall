set -e
python -m pip install .
python -m waterfall -h
python -m waterfall -n 2
python -m waterfall -n 2 --descriptors '^cpu0' 10 'cpu$' memory 100 20 --width 10

python -m pip install .[webserver]

python -m waterfall.server -h
python -m waterfall.client -h

python -m waterfall.server --html &
timeout 10 python -m waterfall.client || [ $? -eq 124 ]

curl -f http://localhost:8888
