import os
import re
import time
import requests
from googleapiclient.discovery import build
from dotenv import load_dotenv

# Load data from .env
load_dotenv()
YOUTUBE_API_KEY = os.environ.get('YOUTUBE_API_KEY')
YTMP3_API_KEY = os.environ.get('YTMP3_API_KEY')

# Retrive video id from URL
def get_yt_video_id(url: str) -> str:
    
    # Url sample
    # https://www.youtube.com/watch?v=B3T50jjIvpg&list=RDMMtc2tW0jFHPo&index=5
    # https://youtu.be/B3T50jjIvpg?si=nlQjeYHGKM-qwCxZ

    """
    Note: regular expression symbol note
        - () use to group a set character or expression
        - ?: use to indicate non-capturing group
        - ? indicate zero or once accurrence
        - \ use to escape special character
        - | = or
        - [] = set of character
        - {} = specific number of occurrence
    """

    # Pattern of URL
    video_url_pattern = r"(?:https://)?(?:www\.)?(?:youtube\.|youtu\.)?(?:com/|be/)?(?:watch\?v=)?([a-zA-Z0-9_-]{11})"

    # Check if url is matched with the pattern
    video_match = re.match(video_url_pattern, url)
    if video_match:
        return video_match.group(1)

    return None


def mp3_api_request(yt_video_id: str) -> dict:

    API_Url = "https://youtube-mp36.p.rapidapi.com/dl" 

    # Prepare querystring
    querystring = {
        "id": yt_video_id,
    }

    # Prepare header, api key
    headers = {
        "X-RapidAPI-Key": YTMP3_API_KEY,
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

def yt_api_request(search_input: str) -> dict:

    # Create resource object to communicate with youtube api
    youtube = build("youtube", "v3", developerKey = YOUTUBE_API_KEY)

    # make api request, provide some parameter to search
    request = youtube.search().list(
        part = "snippet",
        maxResults = 15,
        q = search_input,
        topicId = "/m/04rlf", # Set topic id to music so only music related video will be returned
        type = "video",
    )
    response = request.execute()

    # Filter out response to get only videoID, title, thumbnails
    search_result = []

    for video in response["items"]:
        item = {
            "videoID": video["id"]["videoId"],
            "title": video["snippet"]["title"],
            "thumbnails_url": video["snippet"]["thumbnails"]["high"]
        }
        search_result.append(item)

    return search_result