set -e
python -m pip install .
python -m waterfall -h
python -m waterfall -n 2

python -m pip install .[webserver]

python -m waterfall.server -h
python -m waterfall.client -h

echo "
[Unit]
Description=Monitoring WebServer
[Service]
Type=oneshot
User=ubuntu
ExecStart=python -m waterfall.server
[Install]
WantedBy=multi-user.target
" > /etc/systemd/system/waterfall.service

systemctl daemon-reload
systemctl start waterfall

timeout 10 python -m waterfall.client
