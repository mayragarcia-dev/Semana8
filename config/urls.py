from django.contrib import admin
from django.conf import settings
from django.conf.urls.static import static
from django.urls import include, path
from rest_framework.routers import DefaultRouter

from catalog.views import CategoryViewSet, ProductViewSet
from quiz.views import ExamViewSet, OptionViewSet, QuestionViewSet

api_router = DefaultRouter()
api_router.register("exams", ExamViewSet, basename="exam")
api_router.register("questions", QuestionViewSet, basename="question")
api_router.register("options", OptionViewSet, basename="option")
api_router.register("categories", CategoryViewSet, basename="category")
api_router.register("products", ProductViewSet, basename="product")

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include(api_router.urls)),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
