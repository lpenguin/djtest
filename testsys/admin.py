from django.contrib import admin
from djtest.testsys.models import Property, Test, Scale, TestResult, ScaleValue
from djtest.testsys import admin_views
from django.conf.urls.defaults import patterns, url
#from djtest.testsys import admin_forms

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
	fields = ["name", "description", "instruction", "property", "time", "order"]
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


admin.site.register(Property, PropertyAdmin)
admin.site.register(Test, TestAdmin)
admin.site.register(Scale)
admin.site.register(TestResult)
admin.site.register(ScaleValue)
