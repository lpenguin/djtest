from django.db import models
from django.utils.translation import ugettext as _
from django.db.models import Max
from django.contrib.auth.models import User


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
    property = models.ForeignKey( Property, verbose_name = _('Property') )
    data = models.TextField( blank = True, verbose_name = _('Data') )   
    order = models.IntegerField( blank = True, verbose_name = _("Order") )
    time = models.IntegerField( blank = True, verbose_name = _('Time to make'), default = 0, null = True)
#    scale = models.ManyToManyField( 'Scale' )
    
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
    
    def __unicode__(self):
        return self.user.username + " - " + self.test.name
    class Meta:
        verbose_name = _('Test result')
        verbose_name_plural = _('Test results')