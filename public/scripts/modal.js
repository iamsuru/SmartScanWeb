var modal = document.getElementById('myModal')
var uploadFileBtn = document.getElementById('uploadFile');
var closeBtn = document.getElementsByClassName('close')[0];
var qrOpenerBtn = document.getElementById('qrOpener')
var optionsDiv = document.querySelector('.options');
var optionQRDiv = document.querySelector('.optionQR')
var fileInput = document.getElementById('fileInput')
var qr = ''
var intervalId
var url = 'https://smartscan.onrender.com/'
// var url = 'https://localhost:2000/'
const uniqueID = generateUniqueID()

function hideMainModel(){
    modal.style.display = 'none'
    if (fileInput && fileInput.files.length > 0) {
        fileInput.value = '';
    }
}

function hideQrModel(){
    optionQRDiv.style.display = 'none'
    clearInterval(intervalId)
}

uploadFileBtn.addEventListener('click', () => {
    modal.style.display = 'block'
    if(optionsDiv.style.display === 'none'){
        optionsDiv.style.display = 'block'
        hideQrModel()
    }
    if (uniqueID) {
        fetch('/sendLocationString', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ location: uniqueID })
        })
            .then(response => response.json())
            .then(data => {
                console.log('Server response:', data);
            })
            .catch(error => {
                console.error('Error sending data to server:', error);
            })
    }
})


document.addEventListener('DOMContentLoaded', function () {
    optionsDiv.style.display = 'block';
    hideQrModel()
});

qrOpenerBtn.addEventListener('click', function () {
    if (optionsDiv.style.display === 'block') {
        optionsDiv.style.display = 'none';
    }
    const locationName = generateUniqueID()
    generateQRCode(locationName)
    showQrImage(locationName)
    optionQRDiv.style.display = 'block'
});

closeBtn.addEventListener('click', () => {
    hideMainModel()
    hideQrModel()
})

window.addEventListener('click', (event) => {
    if (event.target === modal) {
        hideMainModel()
    }
})

fileInput.addEventListener('change', (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
        const fileURL = URL.createObjectURL(selectedFile)
        document.getElementById('iFrame').src = fileURL
        document.getElementById('fileName').textContent = selectedFile.name
        var formData = new FormData()
        formData.append('document-to-upload', selectedFile)
        fetch('/uploadFromMobile', {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (response.ok) {
                try {
                    return response.json(); // Try parsing response as JSON
                } catch (error) {
                    console.error('Error parsing JSON response:', error);
                    // Handle non-JSON responses here (e.g., error pages, text, etc.)
                    return response.text(); // Treat non-JSON response as text
                }
            }
            throw new Error('Network response was not ok.');
        })
        .then(data => {
            console.log('PDF file uploaded successfully:', data);
        })
        .catch(error => {
            //console.error('Error uploading PDF file:', error);
        });
        hideMainModel()
    } else {
        console.log('No file selected.');
    }
})

function generateUniqueID(){
    let key = ''
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length
    for (var i = 0; i < 6; i++) {
        key += characters.charAt(Math.floor(Math.random() * charactersLength))
    }
    return key;
}

function generateQRCode(uniqueID) {
    qr = new QRious({
        element: document.getElementById('qrcode'),
        size: 200,
        value: ''
    })

    qr.set({
        value: url + 'uploadFile?location=' + uniqueID
    })
    console.log(qr.value)
}

async function showQrImage(uniqueID) {
    let seconds = 59;
    const timerLabel = document.getElementById('timer');
    intervalId = setInterval(async () => {
        timerLabel.textContent = `${seconds} Seconds`;
        if (seconds <= 0) {
            clearInterval(intervalId);
            hideMainModel()
        } else {
            seconds--;
            const pdfUrl = `/uploads/user/${uniqueID}.pdf`;
            try {
                const response = await fetch(pdfUrl);
                if (response.status === 200) {
                    console.log('File exists');
                    clearInterval(intervalId);
                    document.getElementById('iFrame').src = pdfUrl;
                    hideMainModel()
                } else if (response.status === 404) {
                    //console.log('File not found');
                } else {
                    console.error('Error checking file existence. Status:', response.status);
                }
            } catch (error) {
                console.error('Error checking file existence:', error);
            }
        }
    }, 1000);
}