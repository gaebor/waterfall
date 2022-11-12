# -*- coding: utf-8 -*-
from setuptools import setup

setup(
    name='waterfall',
    version='0.1',
    description="a minimalistic and OS agnostic resource monitoring tool",
    author="Gábor Borbély",
    author_email='borbely@math.bme.hu',
    url='https://github.com/gaebor/waterfall',
    license='MIT',
    install_requires=['termcolor', 'psutil'],
    extras_require={'webserver': ['tornado']},
    packages=['waterfall'],
)
