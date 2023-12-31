import json

from . import util

from django.shortcuts import render
from django.http import JsonResponse

# Create your views here.

def index(request):
    return render(request, 'YTToMp3App/index.html')


# Convert youtube to mp3
def converter(request):
    return render(request, 'YTToMp3App/converter.html')


def mp3APIRequest(request):

    if request.method != "POST":
        return JsonResponse({
            "error": "POST request required."
        }, status=400)
    
    # parsaing JSON data
    data = json.loads(request.body)
    if not data["input"]:
        return JsonResponse({
            "error": "Please provide a youtube video url"
        }, status=400)

    # Retrive video id from url
    yt_video_id = util.get_yt_video_id(data["input"])
    if not yt_video_id:
        return JsonResponse({
            "error": "Invalid youtube video url."
        }, status=400)

    # Send api request
    response = util.mp3_api_request(yt_video_id)
    if response["status"] == "fail":
        return JsonResponse({
            'error': response["msg"]
        })

    return JsonResponse({
        'response': response
    }, status=200)


def youtubeAPIRequest(request):

    if request.method != "POST":
        return JsonResponse({
            "error": "POST request required."
        }, status=400)

    data = json.loads(request.body)
    if not data["search_input"]:
        return JsonResponse({
            "error": "Please provide a input to search"
        }, status=400)
    
    # Send api request to youtube
    search_video, search_info = util.yt_api_request(data["search_input"], data["next_page_token"])

    # When there is error return in search video, mean that there is error in request to youtube api
    if "error" in search_video:
        return JsonResponse({
            "error": search_video["error"]
        }, status=400)

    return JsonResponse({
        'search_video': search_video,
        'search_info': search_info
    }, status=200)

def about(request):
    return render(request, 'YTToMp3App/about.html')