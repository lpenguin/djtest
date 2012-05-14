from django.contrib import admin
from djtest.testsys.models import Property, Test, Scale, TestResult, TotalTestResult
from djtest.testsys import admin_views
from django.conf.urls.defaults import patterns, url
from admin_widgets import TestResultWidget, TotalTestResultWidget
from django.utils.translation import ugettext as _
from django.forms import ModelForm
#from djtest.testsys import admin_forms

from django import forms


class TestResultForm(forms.BaseModelForm):
	result = forms.Field( label = _("Results"), widget=TestResultWidget)
	class Meta:
		model = TestResult
		

class TestInline(admin.StackedInline):
	model = Test
	extra = 0

class PropertyAdmin(admin.ModelAdmin):
	#inlines = [TestInline]
	pass

class ScaleInline(admin.TabularInline):
	model = Scale
	extra = 0

class TestAdmin(admin.ModelAdmin):
	inlines = [ScaleInline]
	change_form_template = 'admin/test_change.html'
	fields = ["name", "description", "instruction", "property", "time", "order", 'is_form']
	ordering = ("order", )
	def get_urls(self):
		urls = super(TestAdmin, self).get_urls()
		my_urls = patterns('',
			url(r'^(?P<testId>\d+)/edit/$', 
					self.admin_site.admin_view(admin_views.test_edit), 
					name='%s_%s_edit' % (self.model._meta.app_label, self.model._meta.module_name))
		)
		return my_urls + urls
	class Media:
		js = (
			  r"/static/javascript/jquery.js",
			  r"/static/javascript/underscore.js",
			  r"/static/javascript/backbone.js",
			  r"/static/javascript/jquery.tmpl.js",
			  r"/static/javascript/json2.js",
			  r"/static/javascript/test-editor.js"
			)

class TestResultAdmin(admin.ModelAdmin):
    model = TestResult
    change_form_template = 'admin/test_result_change.html'
	#readonly_fields = ["resultData"]
	#form = TestResultForm
	#def formfield_for_dbfield(self, db_field, **kwargs):
	#	if db_field.name == 'resultData':
	#		kwargs['widget'] = TestResultWidget
	#	return super(TestResultAdmin,self).formfield_for_dbfield(db_field,**kwargs)
	
class TotalTestResultForm(ModelForm):
    class Meta: 
        model = TotalTestResult 
    def __init__(self, *args, **kwargs): 
        super(TotalTestResultForm, self).__init__(*args, **kwargs) 
        try: 
            instance = kwargs['instance'] 
            self.fields['resultData'].initial = 'a'#instance.price() 
        except (KeyError, AttributeError): 
            pass 
            

class TotalTestResultAdmin(admin.ModelAdmin):
    model = TotalTestResult
    change_form_template = 'admin/total_test_result_change.html'
    readonly_fields = ('user', 'date')
    fields =  ('user', 'date',  )
    #def formfield_for_dbfield(self, db_field, **kwargs):
    #    if db_field.name == 'resultData':
    #        kwargs['widget'] = TotalTestResultWidget
    #    return super(TotalTestResultAdmin,self).formfield_for_dbfield(db_field,**kwargs)

admin.site.register(Property, PropertyAdmin)
admin.site.register(Test, TestAdmin)
admin.site.register(Scale)
admin.site.register(TotalTestResult, TotalTestResultAdmin)
admin.site.register(TestResult, TestResultAdmin)
#admin.site.register(ScaleValue)
