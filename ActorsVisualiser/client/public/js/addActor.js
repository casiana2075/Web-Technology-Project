if (!document.cookie.includes('username')) {
    window.location.href = 'homePage.html';
}

let dropArea = document.getElementById('drop-area')

;['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
  dropArea.addEventListener(eventName, preventDefaults, false)
})

function preventDefaults (e) {
  e.preventDefault()
  e.stopPropagation()
}

;['dragenter', 'dragover'].forEach(eventName => {
  dropArea.addEventListener(eventName, highlight, false)
})

;['dragleave', 'drop'].forEach(eventName => {
  dropArea.addEventListener(eventName, unhighlight, false)
})

function highlight(e) {
  dropArea.classList.add('highlight')
}

function unhighlight(e) {
  dropArea.classList.remove('highlight')
}

dropArea.addEventListener('drop', handleDrop, false)

function handleDrop(e) {
  let dt = e.dataTransfer
  let files = dt.files

  handleFiles(files)
}

function handleFiles(files) {
  ([...files]).forEach(uploadFile)
}

function uploadFile(file) {
  let url = 'YOUR_URL_HERE'
  let xhr = new XMLHttpRequest()
  let formData = new FormData()
  xhr.open('POST', url, true)
  xhr.addEventListener('readystatechange', function(e) {
    if (xhr.readyState == 4 && xhr.status == 200) {
      // File uploaded successfully
    }
    else if (xhr.readyState == 4 && xhr.status != 200) {
      // Error. Inform the user
    }
  })
  formData.append('file', file)
  xhr.send(formData)
}



document.getElementById('addActorButton').onclick = event => {
  event.preventDefault();
  const name = document.getElementById('actorName').value;
  const details = document.getElementById('actorDetails').value;
  const birthday = document.getElementById('actorBirthday').value;
  const deathday = document.getElementById('actorDeathday').value;
  const birthplace = document.getElementById('actorPlaceOfBirth').value;
  const knownfor = document.getElementById('actorKnownFor').value;


  console.log(name, details, birthday, deathday, birthplace, knownfor);

  fetch('http://localhost:3001/api/actors', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, details, birthday, deathday, birthplace, knownfor })
  }).then(response => {
      if (response.status === 200) {
          //window.reload();
      } else {
          response.json().then(data => {
              const errorDiv = document.getElementById('error-message');
              const errorMessage = document.createElement('p');
              errorMessage.textContent = data.message;
              errorMessage.style.color = 'red';
              errorMessage.style.fontSize = '14px';
              errorMessage.style.fontWeight = 'bold';
              errorMessage.classList.add('fade-in');
              
              errorDiv.innerHTML = '';
              errorDiv.appendChild(errorMessage);

          });
      }
  });
};