python -m pip install .
IF %ERRORLEVEL% NEQ 0 (exit 1)

python -m waterfall -h
IF %ERRORLEVEL% NEQ 0 (exit 1)
python -m waterfall -n 2
IF %ERRORLEVEL% NEQ 0 (exit 1)
python -m waterfall -n 2 --descriptors "^^cpu0" 10 "cpu$" memory 100 20 --width 10
IF %ERRORLEVEL% NEQ 0 (exit 1)

python -m pip install .[webserver]
IF %ERRORLEVEL% NEQ 0 (exit 1)

python -m waterfall.server -h
IF %ERRORLEVEL% NEQ 0 (exit 1)
python -m waterfall.client -h
IF %ERRORLEVEL% NEQ 0 (exit 1)

START /B "waterfall.server" python -m waterfall.server
START /B "waterfall.client" python -m waterfall.client

TIMEOUT /T 10 /NOBREAK 2> nul

TASKLIST /FI "STATUS EQ running" /FI "WINDOWTITLE EQ waterfall.server" /NH | findstr /I python
IF %ERRORLEVEL% NEQ 0 (exit 1)

TASKLIST /FI "STATUS EQ running" /FI "WINDOWTITLE EQ waterfall.client" /NH | findstr /I python
IF %ERRORLEVEL% NEQ 0 (exit 1)
