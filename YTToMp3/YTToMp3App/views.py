import json

from . import util

from django.shortcuts import render
from django.http import JsonResponse

# Create your views here.

def index(request):
    return render(request, 'YTToMp3App/index.html')

def mp3APIRequest(request):

    if request.method == "POST":
        
        # parsaing JSON data
        data = json.loads(request.body)
        
        # Retrive video id from url
        yt_video_id = util.get_yt_video_id(data['ytVideoUrl'])

        # Send api request
        response = util.api_request(yt_video_id)

        return JsonResponse({
            'response': response.json()
        },
        status=200)

    return JsonResponse({
            'msg': 'error'
        },
        status=200)