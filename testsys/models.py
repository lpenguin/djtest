from django.db import models
from django.utils.translation import ugettext as _
from django.db.models import Max
from django.contrib.auth.models import User
from django.db.models import signals

class UserProfile(models.Model):
  user = models.ForeignKey(User, unique=True)
  fio = models.TextField(blank=True)
  homePhone = models.TextField(blank=True)
  cellPhone = models.TextField(blank=True)
  age = models.TextField(blank=True)
  addressRegister = models.TextField(blank=True)
  addressLive = models.TextField(blank=True)
  metro = models.TextField(blank=True)
  family = models.TextField(blank=True)
  yearsDiscout = models.TextField(blank=True)
  yearsWork = models.TextField(blank=True)
  programsKnowing = models.TextField(blank=True)

class TestType:
  Test=0
  Form=1
  
class Property(models.Model):
    name = models.CharField( max_length = 30, verbose_name = _('Name') )
    description = models.TextField( blank = True, verbose_name = _('Description') )

    def __unicode__(self):
        return _(self.name)
    class Meta:
        verbose_name = _('Property')
        verbose_name_plural = _('Properties')

class Test(models.Model):
    name = models.CharField( max_length = 30, verbose_name = _('Name') )
    description = models.TextField( blank = True, verbose_name = _('Description') )
    instruction = models.TextField( blank = True, verbose_name = _('Instruction') )
    instruction.allow_tags = True
    property = models.ForeignKey( Property, verbose_name = _('Property') ) 
    data = models.TextField( blank = True, verbose_name = _('Data') )   
    order = models.IntegerField( blank = True, verbose_name = _("Order") )
    time = models.IntegerField( blank = True, verbose_name = _('Time to make'), default = 0, null = True)
    type = models.IntegerField( blank = True, verbose_name = _('Test type'), default = 0, null = True)
    is_form = models.BooleanField( verbose_name = _('Form'), default = False )
	  
    def save(self):
        if not self.id:
            args = Test.objects.all()
            if args:
                res = args.aggregate(max_order = Max('order'))
                self.order = res["max_order"] + 1
            else:
                self.order = 0
                
        super(Test, self).save()

    def __unicode__(self):
        return self.name
    class Meta:
        verbose_name = _('Test')
        verbose_name_plural = _('Tests')
        
class Scale(models.Model):
    name = models.CharField( max_length = 30, verbose_name = _('Name') )
    description = models.TextField( blank = True, verbose_name = _('Description') )
    test = models.ForeignKey( Test, verbose_name = _('Test') )
    min = models.IntegerField( blank = True, verbose_name = _('Minimum value'), default = 0, null = True)
    max = models.IntegerField( blank = True, verbose_name = _('Maximum value'), default = 100, null = True)
    
    def __unicode__(self):
        return self.name
    
    class Meta:
        verbose_name = _('Scale')
        verbose_name_plural = _('Scales')

class TestResult(models.Model):
    user = models.ForeignKey( User, verbose_name = _('User') )
    test = models.ForeignKey( Test, verbose_name = _('Test') )
    resultData = models.TextField(blank = True, verbose_name = _('Result data'))
    date = models.DateTimeField( verbose_name = _('Date') )
    
    def resultDataCalulated(self):
		return calculate_results( self, self.resultData )
    resultDataCalulated.allow_tags = True
    
    def __unicode__(self):
        return self.user.username + " - " + self.test.name
    class Meta:
        verbose_name = _('Test result')
        verbose_name_plural = _('Test results')

class TotalTestResult(models.Model):
    user = models.ForeignKey( User, verbose_name = _('User') )
    resultData = models.TextField(blank = True, verbose_name = _('Result data'))
    date = models.DateTimeField( verbose_name = _('Date') )
    
    def resultDataCalulated(self):
		return calculate_total_results( self.user )
    resultDataCalulated.allow_tags = True
    
    def __unicode__(self):
        return self.user.username
    class Meta:
        verbose_name = _('Total test result')
        verbose_name_plural = _('Total test results')
from test_util import calculate_total_results, calculate_results
#class ScaleValue(models.Model):
#    testResult = models.ForeignKey( TestResult, verbose_name = _('Test result') )
#    scale = models.ForeignKey( Scale, verbose_name = _('Scale') )
#    value = models.IntegerField( verbose_name = _('Value'))
#     
#    def __unicode__(self):
#        return self.testResult.user.username + " - " + self.testResult.test.name + " - " +self.scale.name + " = " +str(self.value)
#    
#    class Meta:
#        verbose_name = _('Scale value')
#        verbose_name_plural = _('Scale values')    
    
