from rest_framework import serializers


class GoogleLoginSerializer(serializers.Serializer):
    credential = serializers.CharField(
        write_only=True,
        required=True,
        allow_blank=False,
        trim_whitespace=True,
    )
