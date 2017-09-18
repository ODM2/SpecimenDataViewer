from api.models import FeatureAction, Result, ProcessingLevel, TimeSeriesResult, SamplingFeature, \
    SpatialReference, \
    ElevationDatum, SiteType, ActionBy, Action, Method, DataLoggerProgramFile, DataLoggerFile, \
    InstrumentOutputVariable, DataLoggerFileColumn, DataSet, DataSetResult, MeasurementResultValue, Variable, \
    Specimen
from rest_framework import serializers


class SpecimenSerializer(serializers.ModelSerializer):

    class Meta:
        model = Specimen
        fields = '__all__'


class MeasurementResultValuesSerializer(serializers.ModelSerializer):

    class Meta:
        model = MeasurementResultValue
        fields = ['__all__']


class VariableSerializer(serializers.ModelSerializer):
    class Meta:
        model = Variable
        fields = ['variable_name', 'variable_code', 'variable_type']


class ResultSerializer(serializers.ModelSerializer):
    variable = VariableSerializer(read_only=True, required=False)
    values = MeasurementResultValuesSerializer(read_only=True, required=False, many=True)

    class Meta:
        model = Result
        fields = ['variable',  'result_datetime', 'valid_datetime', 'value_count', 'values',
                  'sampled_medium']


class DataSetResultSerializer(serializers.ModelSerializer):
    results = ResultSerializer(read_only=True, required=False, many=True)

    class Meta:
        model = DataSetResult
        fields = '__all__'


class DataSetSerializer(serializers.ModelSerializer):
    results = ResultSerializer(read_only=True, required=False, many=True)

    class Meta:
        model = DataSet
        fields = '__all__'


class FeatureActionSerializer(serializers.ModelSerializer):
    results = ResultSerializer(read_only=True, required=False, many=True)

    class Meta:
        model = FeatureAction
        fields = ['results']


class SamplingFeatureSerializer(serializers.ModelSerializer):
    feature_actions = FeatureActionSerializer(read_only=True, required=False, many=True)
    specimens = SpecimenSerializer(read_only=True, required=False)

    class Meta:
        model = SamplingFeature
        fields = '__all__'


class SamplingFeatureMetaDataSerializer(serializers.ModelSerializer):
    specimens = SpecimenSerializer(read_only=True, required=False)

    class Meta:
        model = SamplingFeature
        fields = '__all__'
