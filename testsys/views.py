from django.conf import settings
from django.http import HttpResponseRedirect, HttpResponse
from testsys.models import Test, Scale, TestResult
from django.shortcuts import render_to_response
from django.template import RequestContext
from django import forms
from django.utils.translation import ugettext as _
from django.contrib import auth
from datetime import datetime
from test_util import *
import json
import os

class AuthForm(forms.Form):
    username = forms.CharField()
    password = forms.CharField()

def all_tests(request):
    if not request.user.is_authenticated():
        return HttpResponseRedirect("/login")

    if request.method == "POST":
        test = Test.objects.get( id=request.POST['testid'] )
        result = TestResult( test=test, user=request.user, resultData=request.POST["data"], date=datetime.now() )
        
        
        scale_values = calculate_results( result, request.POST["data"] )
        result.resultData = json.dumps(scale_values)
        result.save()
        #for scale_value in scale_values:
        #    scale_value.save()
        
    tests = Test.objects.order_by( 'order')
    
    for test in tests:
        result = TestResult.objects.filter( test=test, user=request.user )
        if result.count() == 0:
            return test_player( request, test.id )
        
    return render_to_response(
            "all_done.html",
            {},
            RequestContext(request, {}),
           )    
		   
def test_player(request, testid):

    try:
        test = Test.objects.get( id=testid )
        test.data = clear_test_answers( test.data )
        #data = test["data"]
        #testData = json.loads(data)
        scales = Scale.objects.filter( test = test )
    except Test.DoesNotExist:
        return "Test does not exist"
    except Scale.DoesNotExist:
        return "Test does not exist"
    else:
        return render_to_response(
            "test_player.html",
            {'test' : test,
             'scales': scales,
             'testid': testid},
            RequestContext(request, {}),
        )
			
def logout(request):
    if request.user.is_authenticated():
        auth.logout(request)
        return HttpResponseRedirect("/login")
  
def login(request):
    error = ''
    if request.method == 'POST':
        form = AuthForm(request.POST)
        if form.is_valid():
            cd = form.cleaned_data
            username = cd['username'] #request.POST.get('username', '')
            password = cd['password'] #request.POST.get('password', '')
            user = auth.authenticate(username=username, password=password)
            if user is not None and user.is_active:
                auth.login( request, user )
                return HttpResponseRedirect("/test")
            else:
                error = _("Incorrect password")
    else:
        form = AuthForm()
    return render_to_response('login_form.html', {'form': form, 'error': error }, RequestContext(request, {}))


    
def handle_uploads(request, keys):
    saved = []
    
    upload_dir = settings.UPLOAD_PATH
    upload_full_path = os.path.join(settings.STATIC_DOC_ROOT,'upload')

    if not os.path.exists(upload_full_path):
        os.makedirs(upload_full_path)

    for key in keys:
        if key in request.FILES:
            upload = request.FILES[key]
            while os.path.exists(os.path.join(upload_full_path, upload.name)):
                upload.name = '_' + upload.name
            dest = open(os.path.join(upload_full_path, upload.name), 'wb')
            for chunk in upload.chunks():
                dest.write(chunk)
            dest.close()
            saved.append((key, os.path.join('/static/upload', upload.name)))
    # returns [(key1, path1), (key2, path2), ...]
    return saved

def upload_file(request):
    if request.method == 'POST':
        saved = handle_uploads(request, ['file'])
        return HttpResponse(saved[0][1])
    return HttpResponseRedirect("/admin/")
#    return "error"
        

