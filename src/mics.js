const util = require('util');
const exec = util.promisify(require('child_process').exec);

async function setMic(id, e) {
	await exec(`pactl set-default-source ${id}`);
}

async function setSpeaker(id, e) {
	await exec(`pactl set-default-sink ${id}`);
}

function mountDevices(stdout) {
	const devices = stdout.split(/  . /).slice(1).filter(name => !name.includes('Monitor of '))
	const selected = stdout.match(/(?<=  \* index: )(.*)(?=\n)/)
	return devices.map(e => { return {
		name: e.match(/\t\tdevice.description = "(.*)(?="\n)/)[1],
		id: e.match(/\tname: <(.*)(?=>\n)/)[1],
		isDefault: e.match(/index: (.*)(?=\n)/)[1] === selected[1]
	}})
}

async function listMics() {
	const { stdout } = await exec("pacmd list-sources | grep -e 'index:' -e device.description -e 'name:' -e 'properties:'");
	return mountDevices(stdout)
};

async function listSpeakers() {
	const { stdout } = await exec("pacmd list-sinks | grep -e 'index:' -e device.description -e 'name:' -e 'properties:'");
	return mountDevices(stdout)
};

module.exports = {
	listMics,
	listSpeakers,
	setMic,
	setSpeaker
};


