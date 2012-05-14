  # Django settings for djtest project.
import os

PROJECT_ROOT = os.path.dirname(__file__).replace('\\','/')
DEBUG = True
TEMPLATE_DEBUG = DEBUG

ACCOUNT_ACTIVATION_DAYS = 2


AUTH_USER_EMAIL_UNIQUE = True

EMAIL_HOST = "smtp.alwaysdata.com"
EMAIL_HOST_USER = "lilacpenguin@alwaysdata.net"
EMAIL_HOST_PASSWORD = "gfhjkm"
DEFAULT_FROM_EMAIL = "lilacpenguin@alwaysdata.net"
EMAIL_PORT = "25"

EMAIL_USE_TLS = False

    
ADMINS = (
    # ('Your Name', 'your_email@domain.com'),
)

MANAGERS = ADMINS

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3', # Add 'postgresql_psycopg2', 'postgresql', 'mysql', 'sqlite3' or 'oracle'.
        'NAME': PROJECT_ROOT + '/main.db',                      # Or path to database file if using sqlite3.
        'USER': '',                      # Not used with sqlite3.
        'PASSWORD': '',                  # Not used with sqlite3.
        'HOST': '',                      # Set to empty string for localhost. Not used with sqlite3.
        'PORT': '',                      # Set to empty string for default. Not used with sqlite3.
    }
}

UPLOAD_PATH = '/upload/'

# Local time zone for this installation. Choices can be found here:
# http://en.wikipedia.org/wiki/List_of_tz_zones_by_name
# although not all choices may be available on all operating systems.
# On Unix systems, a value of None will cause Django to use the same
# timezone as the operating system.
# If running in a Windows environment this must be set to the same as your
# system time zone.
TIME_ZONE = 'America/Chicago'

# Language code for this installation. All choices can be found here:
# http://www.i18nguy.com/unicode/language-identifiers.html
LANGUAGE_CODE = 'ru'

SITE_ID = 1

# If you set this to False, Django will make some optimizations so as not
# to load the internationalization machinery.
USE_I18N = True

# If you set this to False, Django will not format dates, numbers and
# calendars according to the current locale
USE_L10N = True

# Absolute filesystem path to the directory that will hold user-uploaded files.
# Example: "/home/media/media.lawrence.com/"
MEDIA_ROOT = os.path.join( PROJECT_ROOT, 'static' ).replace('\\','/')
STATIC_ROOT = MEDIA_ROOT
COFFEESCRIPT_OUTPUT_DIR = "coffeescript-cache"


AUTH_PROFILE_MODULE = 'testsys.UserProfile'
#COFFEE_PARAMS = "-c"
#COFFEESCRIPT_OUTPUT_DIR = "static/coffeescript-cache"
# URL that handles the media served from MEDIA_ROOT. Make sure to use a
# trailing slash if there is a path component (optional in other cases).
# Examples: "http://media.lawrence.com", "http://example.com/media/"
MEDIA_URL = '/static/'


# URL prefix for admin media -- CSS, JavaScript and images. Make sure to use a
# trailing slash.
# Examples: "http://foo.com/media/", "/media/".
ADMIN_MEDIA_PREFIX = '/media/'

# Make this unique, and don't share it with anybody.
SECRET_KEY = 'fx4i2lf%))oyruicu-+8ss&#eb1ovp_9uz_^l30r_695z(j3=n'

STATIC_DOC_ROOT =  os.path.join( PROJECT_ROOT, 'static').replace('\\','/')
#

INTERNAL_IPS = (
	'127.0.0.1'
)
DEBUG_TOOLBAR_CONFIG = {
	'INTERCEPT_REDIRECTS': False,
}
# List of callables that know how to import templates from various sources.
TEMPLATE_LOADERS = (
    'django.template.loaders.filesystem.Loader',
    'django.template.loaders.app_directories.Loader',
#     'django.template.loaders.eggs.Loader',
)

TEMPLATE_CONTEXT_PROCESSORS = (
     'django.contrib.auth.context_processors.auth',
     )
     
MIDDLEWARE_CLASSES = (
    'django.middleware.common.CommonMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
#    'debug_toolbar.middleware.DebugToolbarMiddleware',
)

ROOT_URLCONF = 'djtest.urls'

TEMPLATE_DIRS = (
    os.path.join( PROJECT_ROOT, 'templates').replace('\\','/'),
    os.path.join( PROJECT_ROOT, 'templates', 'admin').replace('\\','/'),
    # Put strings here, like "/home/html/django_templates" or "C:/www/django/templates".
    # Always use forward slashes, even on Windows.
    # Don't forget to use absolute paths, not relative paths.
)

AUTHENTICATION_BACKENDS = (
    'testsys.email-auth.EmailBackend',
 )

LOCALE_PATHS = (
    '/home/lilacpenguin/opt/lib/python2.6/site-packages/registration/locale',
)

INSTALLED_APPS = (
    'djtest.testsys',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.sites',
    'django.contrib.messages',
    'coffeescript',
    'registration',
    'profiles',
#    'staticfiles',
    # Uncomment the next line to enable the admin:
     'django.contrib.admin',
#     'debug_toolbar',
    # Uncomment the next line to enable admin documentation:
    # 'django.contrib.admindocs',
)
