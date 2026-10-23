from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters, viewsets

from .models import Exam, Option, Question
from .serializers import ExamSerializer, OptionSerializer, QuestionSerializer


class ExamViewSet(viewsets.ModelViewSet):
    queryset = Exam.objects.all().order_by("id")
    serializer_class = ExamSerializer


class QuestionViewSet(viewsets.ModelViewSet):
    queryset = Question.objects.select_related("exam").prefetch_related("options").all().order_by("id")
    serializer_class = QuestionSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ["exam"]
    search_fields = ["text"]


class OptionViewSet(viewsets.ModelViewSet):
    queryset = Option.objects.select_related("question").all().order_by("id")
    serializer_class = OptionSerializer
