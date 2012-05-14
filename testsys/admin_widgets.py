'''
Created on 20.12.2011

@author: prian
'''

from django import forms
from string import Template
from django.utils.safestring import mark_safe
import json

#class TestResultWidget(forms.Field):
#    def __init__(self, attrs={}):
#        super(TestResultWidget, self).__init__()
        
#import django.newforms as forms

class TestResultWidget(forms.TextInput):
    def render(self, name, value, attrs=None):
        values = json.loads( value )
        temps = ""
        for scalevalue in values:
            temps += "<tr><td>%s</td><td>%s</td>" % (scalevalue["scale"]["name"], scalevalue["value"])
        tpl = Template(u"""<table>$colour</table><textarea name="$name" id="id_$name" style="display:none">$value</textarea>""")
        return mark_safe(tpl.substitute(colour=temps, value=json.dumps(values), name=name))
        
class TotalTestResultWidget(forms.TextInput):
    def render(self, name, value, attrs=None):
        tpl = Template(u"""
	    <div id="diagramm"></div>
	    <textarea name="$name" id="id_$name" style="display:none">$value</textarea>
	    
	    <script type="text/javascript" src="/static/javascript/jquery.js"></script>
	    <script type="text/javascript" src="/static/javascript/diagramm.js"></script>
	    <script type="text/javascript" src="/static/javascript/flotr2.min.js"></script>
	    <script>
	    var resultData = $data;
	    drawDiagramm( "diagramm", resultData );
	    </script>
	    """)
        
        return mark_safe(tpl.substitute(data=value, value=value, name=name))