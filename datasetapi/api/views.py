#sdvapi/src/views.py
from django.http import JsonResponse
from datetime import datetime
from django.forms.models import model_to_dict

from api.models import FeatureAction, Result, ProcessingLevel, TimeSeriesResult, SamplingFeature, \
    SpatialReference, \
    ElevationDatum, SiteType, ActionBy, Action, Method, DataLoggerProgramFile, DataLoggerFile, \
    InstrumentOutputVariable, DataLoggerFileColumn, DataSet, DataSetResult, MeasurementResultValue
from django.http import HttpResponse
from django.db.models.query_utils import Q
from api import serializers


def get_sampling_feature(request):
    if request.method == 'GET':
        box = request.GET['box'] if 'box' in request.GET else None
        sampling_feature_type = request.GET['type'] if 'type' in request.GET else None
        sfids = request.GET.getlist('sfids') if 'sfids' in request.GET else None
        if sfids:
            sfids_list = sfids[0].split(",")

        if sampling_feature_type and not sfids:
            sampling_features = SamplingFeature.objects.filter(sampling_feature_type=sampling_feature_type)[:50]
        elif sfids and not sampling_feature_type:
            sampling_features = SamplingFeature.objects.filter(Q(pk__in=sfids_list))
        else:
            sampling_features = SamplingFeature.objects.all()[:100]

        serialized_data = serializers.SamplingFeatureSerializer('json', sampling_features, many=True)
        serialized_data.is_valid()

    else:
        serialized_data = {'error_message': "There was an error with the request. Incorrect method?"}

    return JsonResponse(serialized_data.data, safe=False)


def get_sampling_feature_info(request):
    if request.method == 'GET':
        sampling_feature_type = request.GET('type') if 'type' in request.GET else None
        sfids = request.GET.getlist('sfids[]') if 'sfids' in request.GET else None
        data_set_type = request.GET('datasettype') if 'datasettype' in request.GET else None

        if sampling_feature_type or sfids or data_set_type:
            sampling_features = SamplingFeature.objects.get(Q(sampling_feature_type__id=sampling_feature_type) |
                                                            Q(pk__in=sfids))
        else:
            sampling_features = SamplingFeature.objects.all()

        serialized_data = serializers.SamplingFeatureMetaDataSerializerSerializer('json', sampling_features, many=True)
        serialized_data.is_valid()

    else:
        serialized_data = {'error_message': "There was an error with the request. Incorrect method?"}

    return JsonResponse(serialized_data.data, safe=False)


def get_dataset_metadata(request):
    if request.method == 'GET':
        data_set_id = request.GET.getlist('datasetid') if 'datasetid' in request.GET else None
        data_set_type = request.GET('datasettype') if 'datasettype' in request.GET else None

        if data_set_id and not data_set_type:
            data_set_id = data_set_id[0].split(",")
            data_sets = DataSet.objects.filter(Q(data_set_id__in=data_set_id))
        elif data_set_type:
            data_sets = DataSet.objects.filter(Q(data_set_type__id=data_set_type))
        else:
            data_sets = DataSet.objects.all()[:50]
        serialized_data = serializers.DataSetSerializer('json', data_sets, many=True)
        serialized_data.is_valid()

    else:
        serialized_data = {'error_message': "There was an error with the request. Incorrect method?"}

    return JsonResponse(serialized_data.data, safe=False)


def get_detailed_dataset(request):
    if request.method == 'GET':
        data_set_id = request.GET.getlist('datasetid') if 'datasetid' in request.GET else None
        data_set_type = request.GET('datasettype') if 'datasettype' in request.GET else None

        if data_set_id or data_set_type:
            data_sets = DataSet.objects.get(Q(data_set_id__id=data_set_id) | Q(data_set_type__id=data_set_type))
        else:
            data_sets = DataSet.objects.all()
        serialized_data = serializers.DataSetSerializer('json', data_sets, many=True)
        serialized_data.is_valid()

    else:
        serialized_data = {'error_message': "There was an error with the request. Incorrect method?"}

    return JsonResponse(serialized_data.data, safe=False)


def get_dataset_values(request):
    if request.method == 'GET':
        data_set_id = request.GET.getlist('datasetid') if 'datasetid' in request.GET else None

        if data_set_id:
            data_sets = DataSet.objects.get(datasetid=data_set_id)
        else:
            data_sets = DataSet.objects.all()

        serialized_data = serializers.DataSetSerializer('json', data_sets, many=True)
        serialized_data.is_valid()
    else:
        serialized_data = {'error_message': "There was an error with the request. Incorrect method?"}

    return JsonResponse(serialized_data.data, safe=False)
