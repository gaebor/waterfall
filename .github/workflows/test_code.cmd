python -m pip install .
IF %ERRORLEVEL% NEQ 0 (exit 1)

python -m waterfall -n 2
IF %ERRORLEVEL% NEQ 0 (exit 1)
python -m waterfall -n 2 --descriptors memory 100 20  "^^cpu0" 10 "cpu$" --width 10
IF %ERRORLEVEL% NEQ 0 (exit 1)

python -m pip install .[webserver]
IF %ERRORLEVEL% NEQ 0 (exit 1)

START "waterfall.server" python -m waterfall.server --html
START /B "waterfall.client" python -m waterfall.client
START "waterfall.client" python -m waterfall.client

ping 127.0.0.1 -n 10 > nul

TASKLIST /FI "STATUS EQ running" /FI "WINDOWTITLE EQ waterfall.client" /NH | findstr /I python
IF %ERRORLEVEL% NEQ 0 (exit 1)

curl --fail --max-time 2 http://localhost:8888
IF %ERRORLEVEL% NEQ 0 (exit 1)
