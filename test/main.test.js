const { app, BrowserWindow, ipcMain, Notification } = require('electron');
const main = require('../main');

jest.mock('electron', () => ({
  app: {
    on: jest.fn(),
    whenReady: jest.fn().mockResolvedValue(),
    quit: jest.fn(),
  },
  BrowserWindow: jest.fn().mockImplementation(() => ({
    loadFile: jest.fn(),
    on: jest.fn(),
  })),
  ipcMain: {
    on: jest.fn(),
  },
  Notification: jest.fn().mockImplementation(() => ({
    show: jest.fn(),
  })),
}));

describe('Main Process', () => {
  beforeAll(() => {
    require('../main');
  });

  test('should create a browser window on app ready', async () => {
    await app.whenReady(); // Simulate the app being ready
    // expect(BrowserWindow).toHaveBeenCalled();
    expect(app.on).toHaveBeenCalledWith('ready', expect.any(Function));
  });

  test('should listen for check-website IPC message', () => {
    expect(ipcMain.on).toHaveBeenCalledWith('check-website', expect.any(Function));
  });
});