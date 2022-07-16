# -*- coding: utf-8 -*-
from setuptools import setup
from setuptools.command.install import install
from re import search
from sys import executable


class RegisterCrontab(install):
    def run(self):
        install.run(self)
        name = self.distribution.get_name()
        arguments = self.distribution.script_args
        is_webserver_startup = list(
            filter(bool, (search('\[webserver_startup\]$', argument) for argument in arguments))
        )
        if is_webserver_startup:
            from crontab import CronTab

            with CronTab(user=True) as cron:
                job = cron.new(command=f'"{executable}" -m waterfall.server')
                job.every_reboot()


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
