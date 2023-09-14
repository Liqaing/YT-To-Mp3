// Stack overflow code
// fetch CSRF token from csrftoken cookie
function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== "") {
        var cookie= document.cookie.split(";");
        for (var i = 0; i < cookie.length; i++) {
            var cookie = cookie[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + "=")) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

/*
// Create container(div) that contain video info
function clearInfoContainer() {
    const container = document.querySelector("#info-container");
    container.style.display = "none";
}
*/

// Export function to use in another file
export { getCookie };