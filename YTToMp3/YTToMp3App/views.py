import json

from . import util

from django.shortcuts import render
from django.http import JsonResponse

# Create your views here.

def index(request):
    return render(request, 'YTToMp3App/index.html')


def mp3APIRequest(request):

    if request.method != "POST":
        return JsonResponse({
            "error": "POST request required."
        }, status=400)
    
    # parsaing JSON data
    data = json.loads(request.body)
    
    # Retrive video id from url
    yt_video_id = util.get_yt_video_id(data['ytVideoUrl'])
    if not yt_video_id:
        return JsonResponse({
            "error": "Invalid youtube video url."
        }, status=400)

    # Send api request
    response = util.api_request(yt_video_id)
    if response["status"] == "fail":
        return JsonResponse({
            'error': response["msg"]
        })

    return JsonResponse({
            'response': response
        }, status=200)