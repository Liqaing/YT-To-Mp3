from django.urls import path
from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("converter", views.converter, name="converter"),
    path("about", views.about, name="about"),

    # API request route
    path("mp3APIRequest", views.mp3APIRequest , name="mp3"),
    path("youtubeAPIRequest", views.youtubeAPIRequest, name="youtube")
]