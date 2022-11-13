set -e
python -m pip install .
python -m waterfall -n 2
python -m waterfall -n 2 --descriptors '^cpu0' 10 'cpu$' memory 100 20 --width 10

python -m pip install .[webserver]

python -m waterfall.server --html &
sleep 1
ERRORS=`timeout 10 python -m waterfall.client 3>&2 2>&1 1>&3 || [ $? -eq 124 ]`
echo "$ERRORS"
[ -z "$ERRORS" ]

RESPONSE=`curl --fail --max-time 2 http://localhost:8888 | file -`
echo "$RESPONSE"
[ `echo "$RESPONSE" | grep HTML | wc -l` -gt 0 ]
