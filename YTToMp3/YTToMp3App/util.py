import re
import time
import requests

# Retrive video id from URL
def get_yt_video_id(url: str) -> str:
    
    # Url sample
    # https://www.youtube.com/watch?v=B3T50jjIvpg&list=RDMMtc2tW0jFHPo&index=5
    # https://youtu.be/B3T50jjIvpg?si=nlQjeYHGKM-qwCxZ

    # Pattern of URL
    video_url_pattern = r"^https://(www\.)?(youtube|youtu)?\.(com|be)/(watch\?v=)?([a-zA-Z0-9_-]{11})"

    # Check if url is matched with the pattern
    video_match = re.match(video_url_pattern, url)
    if video_match:
        return video_match.group(5)

    return None


def api_request(yt_video_id: str):

    API_Url = "https://youtube-mp36.p.rapidapi.com/dl" 

    # Prepare querystring
    querystring = {
        "id": yt_video_id,
    }

    # Prepare header, api key
    headers = {
        "X-RapidAPI-Key": "a8efa3d5ddmsh60d42327b681abbp16a867jsn6f00ae74ab68",
	    "X-RapidAPI-Host": "youtube-mp36.p.rapidapi.com",
    }

    # Send API request and then convert response to json
    response = requests.get(API_Url, headers=headers, params=querystring).json()

    # Process data format
    # Convert byte to MB
    response["filesize"] = round(response["filesize"] / 1000000, 2) 
    
    # Convert second to huor:minute:second
    if (response["duration"] > 3600):
        response["duration"] = time.strftime("%H:%M:%S", time.gmtime(response["duration"]))
    else:
        response["duration"] = time.strftime("%M:%S", time.gmtime(response["duration"]))

    return response
