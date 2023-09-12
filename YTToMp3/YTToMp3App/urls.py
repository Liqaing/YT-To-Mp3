from django.urls import path
from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("converter", views.converter, name="converter"),

    # API request route
    path("mp3APIRequest", views.mp3APIRequest , name="mp3"),
    path("youtubeAPIRequest", views.youtubeAPIRequest, name="youtube")
]