import './style.css'

let port;
let reader;
let writer;
let readableStreamClosed;
let writableStreamClosed;

const filters = [
	{ usbVendorId: 9025, usbProductId: 32823 } //arduino micro, see chrome://device-log/
];


const setupEventListeners = () => {
	document.addEventListener('DOMContentLoaded', () => {
		const notSupported = document.querySelector('.notsupported');
		notSupported.classList.toggle('hidden', 'serial' in navigator);
	});

	document.querySelector('.connect').addEventListener('click', handleClickConnect);
}

const handleClickConnect = async () => {
	if (port) {
		await disconnect();
		toggleUIConnected(false);
		return;
	}
	await connect();
}

const connect = async (defaultPort) => {
	// - Request a port and open a connection.
	port = defaultPort;
	if (!port) {
		port = await navigator.serial.requestPort({ filters });
	}

	// - Wait for the port to open.
	await port.open({ baudRate: 9600 });

	let textDecoder = new window.TextDecoderStream();
	readableStreamClosed = port.readable.pipeTo(textDecoder.writable);
	reader = textDecoder.readable.getReader();
	readLoop();

	const textEncoder = new window.TextEncoderStream();
	writableStreamClosed = textEncoder.readable.pipeTo(port.writable);
	writer = textEncoder.writable.getWriter();

	writeToStream('test123');
	toggleUIConnected(true);
}

const disconnect = async () => {
	if (reader) {
		await reader.cancel();
		await readableStreamClosed.catch(() => { /* ignore errors */ });
		reader = null;
		readableStreamClosed = null;
	}

	if (writer) {
		!writer.closed && await writer.close();
		await writableStreamClosed;
		writer = null;
		writableStreamClosed = null;
	}

	await port.close();
	port = null;
}

const readLoop = async () => {
	// eslint-disable-next-line no-constant-condition
	while (true) {
		const { value, done } = await reader.read();
		if (value) {
			console.log('[RECEIVED]', value);
			//log.textContent += value + '\n';
		}
		if (done) {
			console.log('[readLoop] DONE', done);
			reader.releaseLock();
			break;
		}
	}
}

const writeToStream = line => {
	console.log('[SEND]', line);
	writer.write(line);
	writer.releaseLock();
}

const toggleUIConnected = connected => {
	console.log('[toggleUIConnected]', connected);
	const button = document.querySelector('.connect');
	button.textContent = connected ? 'Disconnect' : 'Connect';
}

const tryToConnect = async () => {
	const ports = await navigator.serial.getPorts({ filters });
	if (ports.length > 0) {
		await connect(ports[0]);
	}
}

const init = () => {
	setupEventListeners();
	tryToConnect();
}


init();
