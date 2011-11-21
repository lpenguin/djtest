from django.db import models
from django.utils.translation import ugettext as _
from django.db.models import Max

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
    property = models.ForeignKey( Property, verbose_name = _('Property') )
    data = models.TextField( blank = True, verbose_name = _('Data') )   
    order = models.IntegerField( blank = True, verbose_name = _("Order") )
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

