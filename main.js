'use strict';
const { app, BrowserWindow, shell } = require('electron');

function createWindow () {
  const win = new BrowserWindow({
    width: 1160,
    height: 780,
    minWidth: 940,
    minHeight: 620,
    title: 'Be · Do · Have',
    backgroundColor: '#f7f2e8',
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  win.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  win.loadFile('index.html');
}

app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});