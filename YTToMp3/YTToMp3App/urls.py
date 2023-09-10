from django.urls import path
from . import views

urlpatterns = [
    path("", views.index, name="index"),

    # API request route
    path("mp3APIRequest", views.mp3APIRequest , name="mp3")
]