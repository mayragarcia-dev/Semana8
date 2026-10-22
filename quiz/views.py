from rest_framework import viewsets

from .models import Exam, Option, Question
from .serializers import ExamSerializer, OptionSerializer, QuestionSerializer


class ExamViewSet(viewsets.ModelViewSet):
    queryset = Exam.objects.all().order_by("id")
    serializer_class = ExamSerializer


class QuestionViewSet(viewsets.ModelViewSet):
    queryset = Question.objects.select_related("exam").prefetch_related("options").all().order_by("id")
    serializer_class = QuestionSerializer


class OptionViewSet(viewsets.ModelViewSet):
    queryset = Option.objects.select_related("question").all().order_by("id")
    serializer_class = OptionSerializer
