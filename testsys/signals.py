#profile/signals.py
# -*- coding: utf-8 -*-

from registration.signals import user_registered, user_activated
from testsys.models import UserProfile
from testsys.forms import RegistrationFormProfile
from django.contrib import auth

def user_created(sender, user, request, **kwargs):
    form = RegistrationFormProfile(request.POST)
    profile = UserProfile(user=user, 
      fio = form.data['fio'],
      homePhone = form.data['homePhone'],
      cellPhone = form.data['cellPhone'],
      age = form.data['age'],
      addressRegister = form.data['addressRegister'],
      addressLive = form.data['addressLive'],
      metro = form.data['metro'],
      family = form.data['family'],
      yearsDiscout = form.data['yearsDiscout'],
      yearsWork = form.data['yearsWork'],
      programsKnowing = form.data['programsKnowing'],
      )
    profile.save()

def login_on_activation(sender, user, request, **kwargs):
    user.backend='django.contrib.auth.backends.ModelBackend'
    auth.login(request,user)

user_activated.connect(login_on_activation)
user_registered.connect(user_created)