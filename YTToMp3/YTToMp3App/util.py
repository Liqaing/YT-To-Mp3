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
    
    # Check if responsed video have filesize, it seem that some videos doesn't have filesize
    if response["filesize"]:
        # Convert byte to MB
        response["filesize"] = round(response["filesize"] / 1000000, 2) 
    
    # Convert second to huor:minute:second
    if (response["duration"] > 3600):
        response["duration"] = time.strftime("%H:%M:%S", time.gmtime(response["duration"]))
    else:
        response["duration"] = time.strftime("%M:%S", time.gmtime(response["duration"]))

    return response

def yt_api_request(search_input: str, next_page_token: str) -> dict:

    # Create resource object to communicate with youtube api
    youtube = build("youtube", "v3", developerKey = YOUTUBE_API_KEY)

    # make api request with next_page_token, make sure that there are more page of the result
    if next_page_token and next_page_token > 0:
        # provide search parameters
        request = youtube.search().list(
            part = "snippet",
            type = "video",
            maxResults = 15,
            q = search_input,
            nextPageToken = next_page_token, # For retrive the next set of result 
            topicId = "/m/04rlf", # Set topic id to music so only music related video will be returned
            videoType = "any", # Get any type video, but not live, not upcomming 
        )
        response = request.execute()
    # Without next_page_token
    else: 
        # provide search parameters
        request = youtube.search().list(
            part = "snippet",
            type = "video",
            maxResults = 15,
            q = search_input,
            topicId = "/m/04rlf", # Set topic id to music
            videoType = "any", # Get any type video
        )
        response = request.execute()

    # Retrive search information of the api request
    print(response)
    search_info = {
        # Token for retriving next page in the result
        # Make sure that there are more pages of search results, to be able to retrive next page
        "nextPageToken": response["nextPageToken"] if response["pageInfo"]["resultsPerPage"] > 1 else None,
    }

    # Filter out response to get only videoID, title, thumbnails
    search_video_result = []
    for video in response["items"]:
        item = {
            "videoID": video["id"]["videoId"],
            "title": video["snippet"]["title"],
            "thumbnails_url": video["snippet"]["thumbnails"]["high"]
        }
        search_video_result.append(item)

    return search_video_result, search_info