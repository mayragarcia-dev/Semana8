from rest_framework import serializers

from .models import Exam, Option, Question


class OptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Option
        fields = ["id", "question", "text", "is_correct"]
        read_only_fields = ["id"]


class NestedOptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Option
        fields = ["id", "text", "is_correct"]
        read_only_fields = ["id"]


class QuestionSerializer(serializers.ModelSerializer):
    options = NestedOptionSerializer(many=True)

    class Meta:
        model = Question
        fields = ["id", "exam", "text", "options"]
        read_only_fields = ["id"]

    def validate(self, attrs):
        """Require exactly one correct option on creation or option replacement."""
        options = attrs.get("options")
        if options is None and self.instance is None:
            raise serializers.ValidationError(
                {"options": "Incluye las opciones y exactamente una debe ser correcta."}
            )
        if options is None and self.instance is not None:
            if self.instance.options.filter(is_correct=True).count() != 1:
                raise serializers.ValidationError(
                    {"options": "La pregunta debe tener exactamente una opción correcta."}
                )
        if options is not None:
            correct_count = sum(1 for option in options if option.get("is_correct", False))
            if correct_count != 1:
                raise serializers.ValidationError(
                    {"options": "La pregunta debe tener exactamente una opción correcta."}
                )
        return attrs

    def create(self, validated_data):
        options_data = validated_data.pop("options")
        question = Question.objects.create(**validated_data)
        Option.objects.bulk_create(
            [Option(question=question, **option_data) for option_data in options_data]
        )
        return question

    def update(self, instance, validated_data):
        options_data = validated_data.pop("options", None)
        instance = super().update(instance, validated_data)
        if options_data is not None:
            instance.options.all().delete()
            Option.objects.bulk_create(
                [Option(question=instance, **option_data) for option_data in options_data]
            )
        return instance


class ExamSerializer(serializers.ModelSerializer):
    class Meta:
        model = Exam
        fields = ["id", "title", "description", "created_at"]
        read_only_fields = ["id", "created_at"]
