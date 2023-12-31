import { getCookie } from "./util.js";

document.addEventListener("DOMContentLoaded", function() {
    
    // Add event listener to element
    document.querySelector("#form").addEventListener("submit", sendMp3APIRequest);
    
});

function sendMp3APIRequest(e) {

    // Prevent defualt behaviour of web page
    e.preventDefault();

    // Retrive content of user input
    const inputField = document.querySelector("#video-url");
    const ytVideoUrl = inputField.value;

    // Retrive CSRF token from cookie
    const csrf_token = getCookie("csrftoken")

    // Make request to backend with ytVideoUrl as input 
    fetch("/mp3APIRequest", {
        method: "POST",
        headers: {"X-CSRFToken": csrf_token},
        body: JSON.stringify({
            input: ytVideoUrl,
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
            // Change error message in feedback
            document.querySelector("#invalid-feedback").innerHTML = result.error;

            // Change class of input field to invalid 
            inputField.classList.remove("is-valid");
            inputField.classList.add("is-invalid");
        }
        // If there is no error, the request is succeed
        else {
        
            // Upon succeed, change class of input field to valid, so error message will disappear 
            inputField.classList.remove("is-invalid");
            inputField.classList.add("is-valid");
            
            // Select HTML element
            const title = document.querySelector("#title");
            const duration = document.querySelector("#duration");
            const filesize = document.querySelector("#filesize");
            const downloadLink = document.querySelector("#download-link");

            // Display mp3 info to user
            title.innerHTML = `Title: ${result.response.title}`;
            duration.innerHTML = `Duration: ${result.response.duration}`;
            filesize.innerHTML = `Filesize: ${result.response.filesize} Mb`;
            downloadLink.href = result.response.link;
            
            document.querySelector("#info-container").style.display = "block";
        };
        console.log(result);
        
        // Clear the input field
        inputField.value = "";
    })
    .catch(error => {
        console.log("Error: ", error);
    });

    return false;
}