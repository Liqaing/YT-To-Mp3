import json
import requests

from django.shortcuts import render
from django.http import JsonResponse

# Create your views here.

def index(request):
    return render(request, 'YTToMp3App/index.html')

def mp3APIRequest(request):

    if request.method == "POST":
        # parsaing JSON data
        data = json.loads(request.body)
        print("hi")
        print(data)
        
        return JsonResponse({
            'msg': 'Hi'
        },
        status=200)

    return JsonResponse({
            'msg': 'Hi'
        },
        status=200)