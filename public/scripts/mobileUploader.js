const urlParams = new URLSearchParams(window.location.search);
const locationParameter = urlParams.get('location');
console.log('Location', locationParameter);

window.onload = function(){
    if(locationParameter){
        fetch('/sendLocationString',{
            method : 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body : JSON.stringify({location : locationParameter})
        })
        .then(response => response.json())
        .then(data =>{
            console.log('Server response:', data);
        })
        .catch(error => {
            console.error('Error sending data to server:', error);
        })
    }
}