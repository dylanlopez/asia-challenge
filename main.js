const { app, BrowserWindow, ipcMain, Notification } = require('electron');
const path = require('path');
const puppeteer = require('puppeteer');
const diff = require('diff');
const nodemailer = require('nodemailer');

let mainWindow;
const urlIntervals = {};
const initialStates = {};

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    webPreferences: {
      preload: path.join(__dirname, 'renderer.js'),
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  mainWindow.loadFile('index.html');
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'dylanalejandro.lopezenciso@gmail.com',
    pass: 'yourpassword',
  },
});

ipcMain.on('check-website', async (event, { url, interval, notificationMethod, email }) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);

  let initialContent = await page.content();
  initialStates[url] = initialContent;

  const intervalId = setInterval(async () => {
    await page.reload();
    const newContent = await page.content();

    if (initialStates[url] !== newContent) {
      const changes = diff.diffWords(initialStates[url], newContent);

      event.sender.send('website-check-result', {
        url,
        message: `Change detected at ${new Date().toLocaleTimeString()}`,
        changes,
      });
      initialStates[url] = newContent;
      
      if (notificationMethod === 'system') {
        new Notification({
          title: 'Website Monitor',
          body: `Change detected on ${url}`,
        }).show();
      } else if (notificationMethod === 'email') {
        const mailOptions = {
          from: 'dylanalejandro.lopezenciso@gmail.com',
          to: email,
          subject: 'Website Change Detected',
          text: `Change detected on ${url} at ${new Date().toLocaleTimeString()}`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.log(error);
          } else {
            console.log('Email sent: ' + info.response);
          }
        });
      }

    } else {
      event.sender.send('website-check-result', {
        url,
        message: `No change detected`,
        changes: [],
      });
    }
  }, interval * 60000);

  urlIntervals[url] = intervalId;

  event.sender.send('website-added', { url, interval });
});

ipcMain.on('remove-website', (event, url) => {
  clearInterval(urlIntervals[url]);
  delete urlIntervals[url];
  delete initialStates[url];
});
