import './style.css'
import hexRgb from 'hex-rgb';
import { SerialBinary } from '../../lib/index.js';


const init = () => {
  const serial = new SerialBinary({ log: false });

  serial.onMessage((m) => console.log(m));

  document.querySelector('.connect').addEventListener('click', () => {
    if (!serial.port) {
      serial.connect();
    } else {
      serial.disconnect();
    }
  })

  document.querySelector('.eyedrop').addEventListener('click', () => {
    const resultElement = document.getElementById('result');

    if (!window.EyeDropper) {
      resultElement.textContent = 'Your browser does not support the EyeDropper API';
      return;
    }

    const eyeDropper = new EyeDropper();

    eyeDropper.open().then(result => {
      const rgb = hexRgb(result.sRGBHex);
      console.log(rgb);
      serial.write(new Uint8Array([rgb.red, rgb.green, rgb.blue]));
    }).catch(e => {
      console.log(e)
    });

  })

}

init();
