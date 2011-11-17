from django.conf.urls.defaults import *
#from djtest import settings
from django.conf import settings
# Uncomment the next two lines to enable the admin:
from django.contrib import admin
from djtest.testsys import views
#from djtest.testsys import admin_views

admin.autodiscover()

urlpatterns = patterns('',
    # Example:
    # (r'^djtest/', include('djtest.foo.urls')),

    # Uncomment the admin/doc line below to enable admin documentation:
    # (r'^admin/doc/', include('django.contrib.admindocs.urls')),
    #(r'^admin/testsys/test-edit/(?P<testId>.*)/$', 'testsys.admin_views.edit_test'),
    # Uncomment the next line to enable the admin:
    (r'^admin/', include(admin.site.urls)),
    (r'^static/(?P<path>.*)$', 'django.views.static.serve', {'document_root': settings.STATIC_DOC_ROOT}),
    (r'^upload/$', 'djtest.testsys.views.upload_file'),
)
