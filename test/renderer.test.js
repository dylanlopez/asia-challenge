const { ipcRenderer } = require('electron');

jest.mock('electron', () => ({
  ipcRenderer: {
    send: jest.fn(),
    on: jest.fn(),
  },
}));

describe('Renderer Process', () => {
  beforeEach(() => {
    // Configurar el DOM antes de cada prueba
    document.body.innerHTML = `
      <input type="text" id="url-input" />
      <input type="number" id="interval-input" />
      <select id="notification-method">
        <option value="system">System Notification</option>
        <option value="email">Email</option>
      </select>
      <input type="email" id="email-input" style="display: none;" />
      <button id="add-url">Add URL</button>
      <ul id="url-list"></ul>
    `;

    // Importar renderer.js después de configurar el DOM
    require('../renderer');
  });

  test('should send a check-website message with the correct data', () => {
    document.getElementById('url-input').value = 'https://www.example.com';
    document.getElementById('interval-input').value = 5;
    document.getElementById('notification-method').value = 'system';

    const button = document.getElementById('add-url');
    button.click();

    expect(ipcRenderer.send).toHaveBeenCalledWith('check-website', {
      url: 'https://www.example.com',
      interval: 5,
      notificationMethod: 'system',
      email: '',
    });
  });
});
