from django.conf.urls import url
from api import views

urlpatterns = [
    url(r'^api/v1/samplingfeatures/$', views.get_sampling_feature, name='get-sampling-features'),
    url(r'^api/v1/samplingfeatureinfo/$', views.get_sampling_feature_info, name='get-sampling-feature-info'),
    url(r'^api/v1/datasetmetadata/$', views.get_dataset_metadata, name='get-dataset_metadata'),
    url(r'^api/v1/datasetdetailed/$', views.get_detailed_dataset, name='get-detailed-dataset'),
    url(r'^api/v1/datasetvalues/$', views.get_dataset_values, name='get-dataset-values'),
]