const { ipcRenderer } = require('electron');
const { isValidURL } = require('./utils');

document.getElementById('notification-method').addEventListener('change', (event) => {
  const emailInput = document.getElementById('email-input');
  if (event.target.value === 'email') {
    emailInput.style.display = 'inline';
  } else {
    emailInput.style.display = 'none';
  }
});

document.getElementById('add-url').addEventListener('click', () => {
  const url = document.getElementById('url-input').value;
  const interval = parseInt(document.getElementById('interval-input').value, 10);
  const notificationMethod = document.getElementById('notification-method').value;
  const email = document.getElementById('email-input').value;

  if (isValidURL(url) && interval > 0) {
    ipcRenderer.send('check-website', { url, interval, notificationMethod, email });
  } else {
    alert('Please enter a valid URL and interval.');
  }

  document.getElementById('url-input').value = '';
  document.getElementById('interval-input').value = '';
});

ipcRenderer.on('website-check-result', (event, { url, message, changes }) => {
  const urlListItem = document.querySelector(`[data-url="${url}"]`);
  if (urlListItem) {
    urlListItem.querySelector('.result').textContent = message;
    
    const details = document.getElementById(`details-${url}`);
    if (details) {
      details.querySelector('.details-result').textContent = message;
      details.querySelector('.details-last-checked').textContent = `Last checked: ${new Date().toLocaleTimeString()}`;
      const changesContainer = details.querySelector('.details-changes');
      changesContainer.innerHTML = '';
      changes.forEach(part => {
        const color = part.added ? 'green' :
                      part.removed ? 'red' : 'grey';
        const span = document.createElement('span');
        span.style.color = color;
        console.log(' part.value: ', part.value);
        span.appendChild(document.createTextNode(part.value));
        changesContainer.appendChild(span);
      });
    }
  }
});

ipcRenderer.on('website-added', (event, { url, interval }) => {
  const urlList = document.getElementById('url-list');
  const listItem = document.createElement('li');
  listItem.dataset.url = url;
  listItem.innerHTML = `
    <span>${url} (every ${interval} minutes) <span class="result">Checking...</span></span>
    <button id="details-btn-${url}" onclick="toggleDetails('${url}', ${interval})">Details</button>
    <button onclick="removeURL('${url}')">Remove</button>
    <div id="details-${url}" class="modal" style="display: none;">
      <div class="modal-content">
        <h2>Details for ${url}</h2>
        <p>Interval: ${interval} minutes</p>
        <p class="details-result">Checking...</p>
        <p class="details-last-checked">Last checked: ${new Date().toLocaleTimeString()}</p>
        <div class="details-changes">No changes detected</div>
        <button id="close-details-btn-${url}" onclick="hideDetails('${url}')">Hide Details</button>
      </div>
    </div>
  `;
  urlList.appendChild(listItem);
});

function removeURL(url) {
  ipcRenderer.send('remove-website', url);
  const listItem = document.querySelector(`[data-url="${url}"]`);
  if (listItem) {
    listItem.remove();
  }

  const detailsModal = document.getElementById(`details-${url}`);
  if (detailsModal) {
    detailsModal.remove();
  }
}

function toggleDetails(url, interval) {
  const detailsModal = document.getElementById(`details-${url}`);
  const detailsButton = document.getElementById(`details-btn-${url}`);
  if (detailsModal.style.display === 'none') {
    detailsModal.style.display = 'block';
    detailsButton.textContent = 'Hide Details';
  } else {
    detailsModal.style.display = 'none';
    detailsButton.textContent = 'Details';
  }
}

function hideDetails(url) {
  const detailsModal = document.getElementById(`details-${url}`);
  detailsModal.style.display = 'none';
}
