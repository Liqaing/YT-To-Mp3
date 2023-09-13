import { getCookie } from "./util";

document.addEventListener('DOMContentLoaded', function() {
    
    // Add event listener to element
    document.querySelector('#form').addEventListener('submit', sendMp3APIRequest);
    document.querySelector('#DownloadLink').a
});

function sendMp3APIRequest(e) {

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
            return response.json();
        }
        // Handle unexpected return status
        else {
            console.error(response.status);
            throw new Error('Unexpected response status');
        }
    })
    .then(result => {
        // Handle and display error for client
        if (result.error) {
            // Change error message in feedback
            document.querySelector('#invalid-feedback').innerHTML = result.error;

            // Change class of input field to invalid 
            inputField.classList.remove('is-valid');
            inputField.classList.add('is-invalid');
        }
        // If there is no error, the request is succeed
        else {
            // Upon succeed, change class of input field to valid, so error message will disappear 
            inputField.classList.remove('is-invalid');
            inputField.classList.add('is-valid');
            
            // Display mp3 info to user
            const container = document.querySelector('#info-container');
            container.style.display = 'block';

            // Create new element and add it into info-cantainer
            const title = document.createElement('p');
            title.innerHTML = `Title: ${result.response.title}`;
            container.appendChild(title);

            const duration = document.createElement('p');
            duration.innerHTML = `Duration: ${result.response.duration}`;
            container.append(duration);

            const filesize = document.createElement('p');
            filesize.innerHTML = `Filesize: ${result.response.filesize} Mb`;
            container.appendChild(filesize)

            const downloadLink = document.createElement('a');
            // downloadLink.id = 'DownloadLink'
            downloadLink.innerHTML = 'Download'
            downloadLink.href = result.response.link;
            downloadLink.role = 'button';
            downloadLink.classList = 'btn btn-primary';
            container.appendChild(downloadLink);
        }
        console.log(result);
        
        // Clear the input field
        inputField.value = '';
    })
    .catch(error => {
        console.log('Error: ', error);
    });

    return false;
}