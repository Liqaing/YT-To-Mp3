import { getCookie, clearInfoContainer } from "./util.js";

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
            clearInfoContainer();

            // Upon succeed, change class of input field to valid, so error message will disappear 
            inputField.classList.remove("is-invalid");
            inputField.classList.add("is-valid");
            
            
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