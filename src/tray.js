const { app, Menu, Tray } = require('electron')
const path = require('path');
const EventEmitter = require('events');
const { listMics, listSpeakers, setMic, setSpeaker } = require('./mics')

let tray = null
const changeTracker = new EventEmitter()

async function mountTray() {
	async function mountSubMenu(devices, clickFunction) {
		return devices.map(e => { return {
			label: e.name, checked: e.isDefault, type: 'radio',
			click: () => { clickFunction(e.id, devices), changeTracker.emit('data-changed')},
		}})
	}

	const contextMenu = Menu.buildFromTemplate([
		{ label: 'Mic`s',
			submenu: await mountSubMenu(await listMics(), setMic)
		},
		{ label: 'Speaker`s',
			submenu: await mountSubMenu(await listSpeakers(), setSpeaker)
		},
		{ type: 'separator' },
		{ label: 'Quit', click: () => app.quit()}
	])

	tray.setTitle('easy audio switch')
	tray.setContextMenu(contextMenu)
}

async function createTray() {
	tray = new Tray(path.join(__dirname, '/assets/mic.png'))
	tray.setContextMenu(null)

	await mountTray(tray)
	changeTracker.on('data-changed', () => {
		mountTray(tray)
	})
}

module.exports = {
	createTray,
};

