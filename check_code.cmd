black --check --line-length 99 --skip-string-normalization setup.py waterfall
pylint --min-public-methods=1 --disable=C0114,C0115,C0116 --fail-under 10 --max-line-length 99 setup.py waterfall
