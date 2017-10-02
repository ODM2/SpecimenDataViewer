from api.models import FeatureAction, Result, ProcessingLevel, TimeSeriesResult, SamplingFeature, \
    SpatialReference, \
    ElevationDatum, SiteType, ActionBy, Action, Method, DataLoggerProgramFile, DataLoggerFile, \
    InstrumentOutputVariable, DataLoggerFileColumn, DataSet, DataSetResult, MeasurementResultValue, Variable, \
    Specimen, Site, MeasurementResult
from rest_framework import serializers


class SpecimenSerializer(serializers.ModelSerializer):

    class Meta:
        model = Specimen
        fields = '__all__'


class MeasurementResultValuesSerializer(serializers.ModelSerializer):

    class Meta:
        model = MeasurementResultValue
        fields = '__all__'


class MeasurementResultSerializer(serializers.ModelSerializer):
    measurementresultvalue_set = MeasurementResultValuesSerializer(read_only=True, many=True, required=False)

    class Meta:
        model = MeasurementResult
        fields = ['measurementresultvalue_set']


class VariableSerializer(serializers.ModelSerializer):
    class Meta:
        model = Variable
        fields = ['variable_name', 'variable_code', 'variable_type']


class ResultSerializer(serializers.ModelSerializer):
    variable = VariableSerializer(read_only=True, required=False)
    measurementresult = MeasurementResultSerializer(read_only=True, required=False)

    class Meta:
        model = Result
        fields = '__all__'


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


class SiteSerializer(serializers.ModelSerializer):

    class Meta:
        model = Site
        fields = '__all__'


class SamplingFeatureSerializer(serializers.ModelSerializer):
    feature_actions = FeatureActionSerializer(read_only=True, required=False, many=True)
    specimen = SpecimenSerializer(read_only=True, required=False)
    site = SiteSerializer(read_only=True, required=False)

    class Meta:
        model = SamplingFeature
        fields = '__all__'


class SamplingFeatureMetaDataSerializer(serializers.ModelSerializer):
    specimen = SpecimenSerializer(read_only=True, required=False)
    site = SiteSerializer(read_only=True, required=False)

    class Meta:
        model = SamplingFeature
        fields = '__all__'
