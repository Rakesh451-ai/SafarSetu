from rest_framework import serializers


class AIChatRequestSerializer(serializers.Serializer):
    message = serializers.CharField(required=True)


class AICardSerializer(serializers.Serializer):
    type = serializers.CharField()
    title = serializers.CharField()
    subtitle = serializers.CharField()
    rating = serializers.FloatField(required=False)
    cost = serializers.CharField(required=False)
    safetyLevel = serializers.CharField(required=False)
    tags = serializers.ListField(child=serializers.CharField(), required=False)
    actionLabel = serializers.CharField(required=False)
    destinationId = serializers.CharField(required=False)


class AIMessageResponseSerializer(serializers.Serializer):
    id = serializers.CharField()
    sender = serializers.CharField()
    timestamp = serializers.CharField()
    text = serializers.CharField()
    cards = AICardSerializer(many=True, required=False, allow_null=True)
