import { getCookie } from "./util.js";

document.addEventListener("DOMContentLoaded", function() {

    document.querySelector("#form").addEventListener("submit", sendYTAPIRequest);
    
    // Use event delegation, bind event listener to parent, so when child is dynamically create, the handler will also execute when the event occure on its child element 
    document.querySelector("#search-result-container").addEventListener("click", e => {

        // Handle the event, only when user click on anchor (download)
        if (e.target.tagName === "A") {
            
            // Call function to send api request for mp3 and download
            // pass in video id, which i embedded as data attribute into element
            sendMp3APIRequest(e.target.getAttribute("data-video-id"))
        }
    });

});

function sendYTAPIRequest(e) {
    e.preventDefault();

    // Retrive user input
    const inputField = document.querySelector("#search-input");
    const search_input = inputField.value;

    // Retrive csrf token from cookie
    const csrf_token = getCookie("csrftoken")

    // Make request to backend
    fetch("\youtubeAPIRequest", {
        method: "POST",
        headers: {"X-CSRFToken": csrf_token},
        body: JSON.stringify({
            search_input: search_input,
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
        // Handle and display error for client
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
            
            // Add each video to div for displaying to user 
            
            // Clear all element in the container
            const container = document.querySelector("#search-result-container");
            container.innerHTML = "";

            result.response.forEach((video) => {
                const videoCard = creatVideoCard(video);
                container.appendChild(videoCard);
            });
        };
        console.log(result);

        // Clear the input field
        inputField.value = "";
    })
    .catch(error => {
        console.log("Error: ", error)
    })

    return false;
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
function sendMp3APIRequest(videoID) {

    console.log(videoID)


    // // Retrive content of user input
    // const inputField = document.querySelector("#video-url");
    // const ytVideoUrl = inputField.value;

    // // Retrive CSRF token from cookie
    // const csrf_token = getCookie("csrftoken")

    // // Make request to backend
    // fetch("/mp3APIRequest", {
    //     method: "POST",
    //     headers: {"X-CSRFToken": csrf_token},
    //     body: JSON.stringify({
    //         ytVideoUrl: ytVideoUrl,
    //     })
    // })
    // .then(response => {
    //     if (response.status === 200 || response.status === 400) {
    //         return response.json();
    //     }
    //     // Handle unexpected return status
    //     else {
    //         console.error(response.status);
    //         throw new Error("Unexpected response status");
    //     }
    // })
    // .then(result => {
    //     // Handle and display error for client
    //     if (result.error) {
    //         // Change error message in feedback
    //         document.querySelector("#invalid-feedback").innerHTML = result.error;

    //         // Change class of input field to invalid 
    //         inputField.classList.remove("is-valid");
    //         inputField.classList.add("is-invalid");
    //     }
    //     // If there is no error, the request is succeed
    //     else {
        
    //         // Upon succeed, change class of input field to valid, so error message will disappear 
    //         inputField.classList.remove("is-invalid");
    //         inputField.classList.add("is-valid");
            
    //         // Select HTML element
    //         const title = document.querySelector("#title");
    //         const duration = document.querySelector("#duration");
    //         const filesize = document.querySelector("#filesize");
    //         const downloadLink = document.querySelector("#download-link");

    //         // Display mp3 info to user
    //         title.innerHTML = `Title: ${result.response.title}`;
    //         duration.innerHTML = `Duration: ${result.response.duration}`;
    //         filesize.innerHTML = `Filesize: ${result.response.filesize} Mb`;
    //         downloadLink.href = result.response.link;
            
    //         document.querySelector("#info-container").style.display = "block";
    //     };
    //     console.log(result);
        
    //     // Clear the input field
    //     inputField.value = "";
    // })
    // .catch(error => {
    //     console.log("Error: ", error);
    // });

}