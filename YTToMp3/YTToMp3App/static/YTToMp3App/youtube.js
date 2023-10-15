import { getCookie } from "./util.js";

document.addEventListener("DOMContentLoaded", function() {

    document.querySelector("#form").addEventListener("submit", (e) => {
        // Get the return nextPageToken from fetch function
        let nextPageToken = null;
        sendYTAPIRequest(e, nextPageToken).then(responseNextPageToken => {
            nextPageToken = responseNextPageToken;
        });
    
        // When user scroll to bottom of the page
        window.onscroll = () => {
            if ((window.innerHeight + Math.round(window.scrollY)) >= document.body.offsetHeight) {
                    // Add next page of search result
                    sendYTAPIRequest(e, nextPageToken).then(responseNextPageToken => {
                    nextPageToken = responseNextPageToken;
                });
            }
        }
    });
    
    // Use event delegation, bind event listener to parent, so when child is dynamically create, the handler will also execute when the event occure on its child element 
    document.querySelector("#search-result-container").addEventListener("click", e => {

        // Handle the event, only when user click on anchor (download)
        if (e.target.tagName === "A") {
            
            // Call function to send api request for mp3 and download
            // pass in whichever anchor element object that was click as argument 
            sendMp3APIRequest(e.target);
        }
    });

});

function sendYTAPIRequest(e, nextPageToken) {
    e.preventDefault();

    // Retrive user input
    const inputField = document.querySelector("#search-input");
    const search_input = inputField.value;

    // Retrive csrf token from cookie
    const csrf_token = getCookie("csrftoken")

    // Make request to backend, update html, and return search info back
    return fetch("/youtubeAPIRequest", {
        method: "POST",
        headers: {"X-CSRFToken": csrf_token},
        body: JSON.stringify({
            search_input: search_input,
            next_page_token: nextPageToken,
        })
    })
    .then(response => {
        if (response.status === 200 || response.status === 400) {
              return response.json();
        }
        else {
            console.error(response.status);
            throw new Error("Unexpected response status")
        }
    })
    .then(result => {
        console.log(result)
        // Handle and display error for client
        // When there is error properties in result
        if (result.error) {
            // Change error message in feedback
            document.querySelector("#invalid-feedback").innerHTML = result.error;

            // Change class of input field to invalid 
            inputField.classList.remove("is-valid");
            inputField.classList.add("is-invalid");
        }
        else {
            
            // Upon succeed, change class of input field to valid, so error message will disappear 
            inputField.classList.remove("is-invalid");
            inputField.classList.add("is-valid");
            
            // Check if user request next set of results or new search altogether
            const container = document.querySelector("#search-result-container");
            if (!nextPageToken) {
                // User request new search result, so clear everything in container
                container.innerHTML = "";
            }

            console.log(result)

            // Add each video to div for displaying to user 
            result.search_video.forEach((video) => {
                const videoCard = creatVideoCard(video);
                container.appendChild(videoCard);
            });
        };

        console.log(result);

        // Return and next page token for requesting next set of result
        return result.search_info.nextPageToken
    })
    .catch(error => {
        console.log("Error: ", error)
    })
}

// Create html card for each video
function creatVideoCard(video) {

    // Create div to use in grid layout
    const videoCard = document.createElement('div');
    videoCard.classList.add("col-sm-4", "mt-2");

    // Create card div
    const card = `
        <div class="card">
            <img class="card-img-top img-fluid" src="${video.thumbnails_url.url}" alt="thumbnail">
            <div class="card-body">
                <p class="card-title text-truncate">${video.title}</p>
                <a class="btn btn-primary" data-video-id=${video.videoID} href="#" role="button">Download</a>
            </div>
        </div>
    `;
    // Add card html into div 
    videoCard.innerHTML = card;
    return videoCard;
}

// When user click download, send api to get mp3 link and download the mp3
function sendMp3APIRequest(anchor_element_object) {

    // Retrive the video id, which i embedded as data attribute into the element
    const videoID = anchor_element_object.getAttribute("data-video-id")

    // Retrive CSRF token from cookie
    const csrf_token = getCookie("csrftoken")

    // Using video id as input to make request to backend
    fetch("/mp3APIRequest", {
        method: "POST",
        headers: {"X-CSRFToken": csrf_token},
        body: JSON.stringify({
            input: videoID,
        })
    })
    .then(response => {
        if (response.status === 200 || response.status === 400) {
            return response.json();
        }
        // Handle unexpected return status
        else {
            console.error(response.status);
            throw new Error("Unexpected response status");
        }
    })
    .then(result => {
        // Handle and display error for client
        if (result.error) {

            // Alert user of error
            alert(result.error);
        }
        // If there is no error, the request is succeed, so download the mp3
        else {
            
            // Create new anchor element and simulate a click event on the element to download
            const downloadMp3Link = document.createElement("a");

            // Pass mp3 link into href attribute of anchor element
            downloadMp3Link.href = result.response.link;
            downloadMp3Link.click();
       };
        console.log(result);
    })
    .catch(error => {
        console.log("Error: ", error);
    });
}