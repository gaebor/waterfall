# -*- coding: utf-8 -*-
from setuptools import setup
from setuptools.command.install import install


class RegisterCrontab(install):
    def run(self):
        install.run(self)
        print(self.distribution.script_args)


setup(
    name='waterfall',
    version='0.1',
    description="a minimalistic and OS agnostic resource monitoring tool",
    author="Gábor Borbély",
    author_email='borbely@math.bme.hu',
    url='https://github.com/gaebor/waterfall',
    license='MIT',
    install_requires=['termcolor', 'psutil'],
    extras_require={'webserver': ['tornado'], 'webserver_startup': ['tornado', 'python-crontab']},
    packages=['waterfall'],
    cmdclass={'install': RegisterCrontab},
)
