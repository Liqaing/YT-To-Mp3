import { getCookie } from "./util.js";

document.addEventListener("DOMContentLoaded", function() {

    document.querySelector("#form").addEventListener("submit", sendYTAPIRequest);
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
            const container = document.querySelector("#info-container");
            result.response.forEach((video) => {
                const videoCard = creatVideoCard(video);
                container.appendChild(videoCard);
            });
   
            // Display container
            container.style.display = "inline-flex";
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

function creatVideoCard(video) {

    // Create div to use in grid layout
    const videoCard = document.createElement('div');
    videoCard.classList.add("col-md-4");

    // Create card div
    const card = `
        <div class="card">
            <img class="card-img-top" src="${video.thumbnails_url.url}" alt="thumbnail">
            <div class="card-body">
                <h5 class="card-title">${video.title}</h5>
                <a class="btn btn-primary" href="" role="button">Download</a>
            </div>
        </div>
    `;
    // Add card html into div 
    videoCard.innerHTML = card;
    return videoCard;
}