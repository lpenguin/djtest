from django.conf import settings
from django.http import HttpResponseRedirect, HttpResponse

import os

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
        

