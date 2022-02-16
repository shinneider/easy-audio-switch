const { app, BrowserWindow } = require('electron')
const path = require('path');
const AutoLaunch = require('auto-launch');
const { createTray } = require('./tray')

const autoLauncher = new AutoLaunch({
	name: "Easy Audio Switch",
	isHidden: true
});

function createWindow () {
  const mainWindow = new BrowserWindow({ show: false })
  mainWindow.loadFile(path.join(__dirname, '/index.html'))
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

app.whenReady().then(() => {
	createTray();
	createWindow();

	autoLauncher.isEnabled().then(function(isEnabled) {
		if (isEnabled) return;
		 autoLauncher.enable();
	}).catch(function (err) {
		throw err;
	})
})