set -e
python -m pip install .
python -m waterfall -h
python -m waterfall -n 2
python -m waterfall -n 2 --descriptors '^cpu0' 10 'cpu$' memory 100 20 --width 10

python -m pip install .[webserver]

python -m waterfall.server -h
python -m waterfall.client -h

python -m waterfall.server --html &
ERRORS=`timeout 10 python -m waterfall.client 2>&1 > client.output.txt || [ $? -eq 124 ]`
cat client.output.txt
[ -z "$ERRORS" ]

RESPONSE=`curl --fail --max-time 2 --no-progress-meter http://localhost:8888`
[ -n "`echo "$RESPONSE" | file - | grep HTML`" ]
