document.addEventListener('DOMContentLoaded', function() {
    
    // Add event listener to element
    document.querySelector('#form').addEventListener('submit', sendAPIRequest);

});

function sendAPIRequest(e) {

    // Prevent defualt behaviour of web page
    e.preventDefault();

    // Retrive content of user input
    const ytVideoUrl = document.querySelector('#video_url').value;

    // Retrive CSRF token from cookie
    const csrf_token = getCookie('csrftoken')

    fetch('/mp3APIRequest', {
        method: 'POST',
        headers: {'X-CSRFToken': csrf_token},
        body: JSON.stringify({
            ytVideoUrl: ytVideoUrl,
        })
    })
    .then(response => response.json())
    .then(result => {
        console.log(result)
    })
    .catch(error => {
        console.log('Error: ', error)
    });

    return false;
}


// Stack overflow code
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