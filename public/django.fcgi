#!/usr/bin/eval PATH=$PATH:/home/lilacpenguin/opt/bin PYTHONPATH=/home/lilacpenguin/opt/lib/python2.6/site-packages/ python
import os, sys

_PROJECT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, _PROJECT_DIR)
sys.path.insert(0, os.path.dirname(_PROJECT_DIR))
sys.path.append('/home/lilacpenguin/opt/lib/python2.6/site-packages/django_coffeescript-0.3-py2.6.egg/')
	
_PROJECT_NAME = _PROJECT_DIR.split('/')[-1]
os.environ['DJANGO_SETTINGS_MODULE'] = "%s.settings" % _PROJECT_NAME

from django.core.servers.fastcgi import runfastcgi
runfastcgi(method="threaded", daemonize="false")
