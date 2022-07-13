# -*- coding: utf-8 -*-
from setuptools import setup
from setuptools.command.install import install
from re import match


class RegisterCrontab(install):
    def run(self):
        install.run(self)
        name = self.distribution.get_name()
        arguments = self.distribution.script_args
        is_webserver_startup = list(
            filter(bool, [match('\w+[webserver_startup]', argument) for argument in arguments])
        )
        if is_webserver_startup:
            from crontab import CronTab
            from sys import executable

            with CronTab(tab=f'@reboot "{executable}" -m waterfall.server'):
                pass


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
