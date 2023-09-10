import re
import requests

# Retrive video id from URL
def get_yt_video_id(url: str) -> str:
    
    # Pattern of URL
    video_url_pattern = r"^https://youtu.be/([a-zA-Z0-9_-]{11})"

    # Check if url is matched with the pattern
    video_match = re.match(video_url_pattern, url)
    if video_match:
        return video_match.group(1)

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

    response = requests.get(API_Url, headers=headers, params=querystring)

    return response
