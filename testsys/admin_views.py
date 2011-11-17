from django.shortcuts import render_to_response
from djtest.testsys.models import Test, Scale
from django.template import RequestContext
from django.contrib.admin.views.decorators import staff_member_required
from django.core.context_processors import csrf
from django.http import HttpResponseRedirect
from django.core import urlresolvers
import logging

    
def test_edit(request, testId):
	
	if request.method == 'POST':
		logging.info(request.POST["data"] )
		test = Test.objects.get(id=testId)
		test.data = request.POST["data"];
		test.save()
		return HttpResponseRedirect( urlresolvers.reverse('admin:testsys_test_change', args=(testId,)) )

	try:
		test = Test.objects.get( id=testId )
		scales = Scale.objects.filter( test = test )
	except Test.DoesNotExist:
		return "Test does not exist"
	except Scale.DoesNotExist:
		return "Test does not exist"
	return render_to_response(
		"admin/test_edit.html",
		{'test' : test,
		 'scales': scales,
		 'object_id': testId},
		RequestContext(request, {}),
	)

test_edit = staff_member_required(test_edit)
