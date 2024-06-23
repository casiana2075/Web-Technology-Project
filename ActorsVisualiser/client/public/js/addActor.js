if (!document.cookie.includes('username')) {
  window.location.href = 'homePage.html';
}

let dropArea = document.getElementById('drop-area');
let fileInput = document.getElementById('fileElem');
let uploadedFile = null;

['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
  dropArea.addEventListener(eventName, preventDefaults, false);
});

function preventDefaults(e) {
  e.preventDefault();
  e.stopPropagation();
}

['dragenter', 'dragover'].forEach(eventName => {
  dropArea.addEventListener(eventName, highlight, false);
});

['dragleave', 'drop'].forEach(eventName => {
  dropArea.addEventListener(eventName, unhighlight, false);
});

function highlight(e) {
  dropArea.classList.add('highlight');
}

function unhighlight(e) {
  dropArea.classList.remove('highlight');
}

dropArea.addEventListener('drop', handleDrop, false);

function handleDrop(e) {
  let dt = e.dataTransfer;
  let files = dt.files;

  handleFiles(files);
}

function handleFiles(files) {
  ([...files]).forEach(file => {
    if (file.type.startsWith('image/')) {
      uploadedFile = file;
      let reader = new FileReader();
      reader.onload = (e) => {
        document.getElementById('placeholder').src = e.target.result;
      };
      reader.readAsDataURL(file);
    } else {
      alert("Only image files are allowed!");
    }
  });
}

document.getElementById('addActorButton').onclick = event => {
  console.log('Form submitted');
  event.preventDefault();
  const name = document.getElementById('actorName').value;
  const details = document.getElementById('actorDetails').value;
  const birthday = document.getElementById('actorBirthday').value;
  const deathday = document.getElementById('actorDeathday').value;
  const birthplace = document.getElementById('actorPlaceOfBirth').value;
  const knownfor = document.getElementById('actorKnownFor').value;

  let formData = new FormData();
  formData.append('name', name);
  formData.append('details', details);
  formData.append('birthday', birthday);
  formData.append('deathday', deathday);
  formData.append('birthplace', birthplace);
  formData.append('knownfor', knownfor);

  if (uploadedFile) {
    formData.append('image', uploadedFile);
  }

  fetch('http://localhost:3001/api/actors', {
    method: 'POST',
    body: formData
  }).then(response => {
    if (response.status === 200) {
      const successDiv = document.getElementById('success-message');
      const successMessage = document.createElement('p');
      successMessage.textContent = 'Actor added successfully!';
      successMessage.style.color = 'green';
      successMessage.style.fontSize = '14px';
      successMessage.style.fontWeight = 'bold';
      successMessage.classList.add('fade-in');

      successDiv.innerHTML = '';
      successDiv.appendChild(successMessage);

      setTimeout(() => {
        window.location.reload();
      }, 1000);
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
