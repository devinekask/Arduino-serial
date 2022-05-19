import { SerialText } from '../../lib/index.js';
import './style.css'

let serial;


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
  if (!serial.port) {
    await serial.connect();
    toggleUIConnected(true);
    serial.write('Lets go!');
  } else {
    await serial.disconnect()
    toggleUIConnected(false);
  }
}

const handleFormSubmit = e => {
  e.preventDefault();
  serial.write(e.target.message.value);
  e.target.reset();
}

const init = () => {
  serial = new SerialText({ log: false });
  serial.onMessage(addToReceived);
  setupEventListeners();
}

init();
