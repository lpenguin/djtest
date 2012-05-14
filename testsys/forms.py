from django import forms
from registration.forms import RegistrationFormUniqueEmail
from testsys.models import UserProfile
from django.utils.translation import ugettext as _

class RegistrationFormProfile(RegistrationFormUniqueEmail):
    fio = forms.CharField(label=_('FIO'))
    homePhone = forms.CharField(label=_('Home phone'))
    cellPhone = forms.CharField(label=_('Cell phone'))
    age = forms.CharField(label=_('Age'))
    addressRegister = forms.CharField(label=_('Registration address'))
    addressLive = forms.CharField(label=_('Living address'))
    metro = forms.CharField(label=_('Metro station'))
    family = forms.CharField(label=_('Family status'))
    yearsDiscout = forms.CharField(label=_('Years discount'))
    yearsWork = forms.CharField(label=_('Working home'))
    programsKnowing = forms.CharField(label=_('Knowed programs'))