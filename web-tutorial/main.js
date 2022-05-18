import './style.css'

let port;
let reader;
let inputDone;
let outputDone;
let inputStream;
let outputStream;

const filters = [
  { usbVendorId: 9025, usbProductId: 32823 } //arduino micro, see chrome://device-log/
];

const connect = async (defaultPort) => {
  port = defaultPort;
  if (!port) {
    port = await navigator.serial.requestPort({ filters });
  }

  await port.open({ baudRate: 9600 });

  let decoder = new window.TextDecoderStream();
  inputDone = port.readable.pipeTo(decoder.writable);
  inputStream = decoder.readable;

  reader = inputStream.getReader();
  readLoop();

  const encoder = new window.TextEncoderStream();
  outputDone = encoder.readable.pipeTo(port.writable);
  outputStream = encoder.writable;

  writeToStream('Lets go!');
  toggleUIConnected(true);
}

const disconnect = async () => {
  if (reader) {
    await reader.cancel();
    await inputDone.catch(() => { });
    reader = null;
    inputDone = null;
  }

  if (outputStream) {
    await outputStream.getWriter().close();
    await outputDone;
    outputStream = null;
    outputDone = null;
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
      addToReceived(value);
    }
    if (done) {
      console.log('[readLoop] DONE', done);
      reader.releaseLock();
      break;
    }
  }
}

const writeToStream = line => {
  if (!outputStream || line.trim() === "") return;
  const writer = outputStream.getWriter();
  console.log('[SEND]', line);
  writer.write(line);
  writer.releaseLock();
}

const tryToConnect = async () => {
  const ports = await navigator.serial.getPorts({ filters });
  if (ports.length > 0) {
    await connect(ports[0]);
  }
}

const addToReceived = line => {
  document.querySelector('.received').textContent = line + document.querySelector('.received').textContent;
}

const toggleUIConnected = connected => {
  console.log('[toggleUIConnected]', connected);
  const button = document.querySelector('.connect');
  button.textContent = connected ? 'Disconnect' : 'Connect';
}

const setupEventListeners = () => {
  document.addEventListener('DOMContentLoaded', () => {
    const notSupported = document.querySelector('.notsupported');
    notSupported.classList.toggle('hidden', 'serial' in navigator);
  });

  document.querySelector('.connect').addEventListener('click', handleClickConnect);
  document.querySelector('.form').addEventListener('submit', handleFormSubmit)
}

const handleClickConnect = async () => {
  if (port) {
    await disconnect();
    toggleUIConnected(false);
    return;
  }
  await connect();
}

const handleFormSubmit = e => {
  e.preventDefault();
  writeToStream(e.target.message.value);
  e.target.reset();
}

const init = () => {
  setupEventListeners();
  tryToConnect();
}

init();
