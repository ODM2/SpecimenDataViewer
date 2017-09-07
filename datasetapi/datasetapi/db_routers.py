import sys


class WebSDLRouter(object):
    def db_for_read(self, model, **hints):
        is_testing = 'test' in sys.argv
        if model._meta.app_label == 'api' or is_testing:
            return 'ODM2Samples'
        return 'default'

    def db_for_write(self, model, **hints):
        is_testing = 'test' in sys.argv
        if model._meta.app_label in ['api'] or is_testing:
            return 'ODM2Samples'
        return 'default'

    def allow_migrate(self, db, app_label, **hints):
        is_testing = 'test' in sys.argv
        unmanaged_apps = ['apis']
        allow = app_label not in unmanaged_apps or is_testing
        return allow
