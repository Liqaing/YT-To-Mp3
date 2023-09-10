document.addEventListener('DOMContentLoaded', function() {
    
    // Add event listener to element
    document.querySelector('#form').addEventListener('submit', sendAPIRequest);

});

function sendAPIRequest(e) {

    // Prevent defualt behaviour of web page
    e.preventDefault();

    // Retrive content of user input
    const inputField = document.querySelector('#video-url');
    const ytVideoUrl = inputField.value;

    // Retrive CSRF token from cookie
    const csrf_token = getCookie('csrftoken')

    fetch('/mp3APIRequest', {
        method: 'POST',
        headers: {'X-CSRFToken': csrf_token},
        body: JSON.stringify({
            ytVideoUrl: ytVideoUrl,
        })
    })
    .then(response => {
        if (response.status === 200 || response.status === 400) {
            return response.json()
        }
        // Handle unexpected return status
        else {
            console.error(response.status)
            throw new Error('Unexpected response status');
        }
    })
    .then(result => {
        // Handle and display error for client
        if (result.error) {
            // Change error message in feedback
            document.querySelector('#invalid-feedback').innerHTML = result.error

            // Change class of input field to invalid 
            inputField.classList.remove('is-valid');
            inputField.classList.add('is-invalid');
        }
        // If there is no error, the request is succeed
        else {

            // Upon succeed, change class of input field to valid, so error message will disappear 
            inputField.classList.remove('is-invalid');
            inputField.classList.add('is-valid');
        }
        console.log(result)
        
        // Clear the input field
        inputField.value = '';
    })
    .catch(error => {
        console.log('Error: ', error)
    });

    return false;
}


// Stack overflow code
// fetch CSRF token from csrftoken cookie
function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookie= document.cookie.split(';');
        for (var i = 0; i < cookie.length; i++) {
            var cookie = cookie[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}