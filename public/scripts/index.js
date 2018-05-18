const displayResponseMessage = (response) => {
  const responseMessage = `<p>${response.token || response.error}</p>`;
  document.querySelector('#response-display').innerHTML = responseMessage;
};

const postCredentials = (email, appName) => {
  fetch('/api/v1/authenticate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, appName }),
  })
    .then(response => response.json())
    .then(response => displayResponseMessage(response))
    .catch(error => displayResponseMessage(error));
};

const submitForm = (event) => {
  const { email, appName } = event.target;
  event.preventDefault();
  postCredentials(email.value, appName.value);
};

document.querySelector('form').addEventListener('submit', submitForm);
