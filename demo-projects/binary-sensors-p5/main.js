import './style.css'

import { SerialBinary } from "../../lib/index.js";
import { sketch } from 'p5js-wrapper';

let serial;
let vector;
let bg = 200;

const init = async () => {
  serial = new SerialBinary({ log: false });

  serial.onMessage(handleIncomingMessage);
  await connect();

  document.querySelector("#connect").addEventListener('click', async (e) => {
    if (!serial.port) {
      await connect();
    } else {
      await serial.disconnect();
      e.target.innerText = "Connect";
    }
  })

  sketch.setup = function () {
    createCanvas(800, 600);
    vector = createVector(0, 0);
  };

  sketch.draw = function () {
    background(bg);
    strokeWeight(4);
    push();
    translate(width / 2, height / 2);
    rotate(vector.heading());
    line(0, 0, vector.mag() * 250, 0);
    pop();
  };

}

const connect = async () => {
  const connected = await serial.connect();
  if (connect) {
    serial.write(new Uint8Array([65]));
    document.querySelector("#connect").innerText = "Disconnect";
  }
}


const handleIncomingMessage = message => {
  if (message[0] == 65) {
    //serial.clear();
    serial.write(new Uint8Array([65]));
  } else {
    const [potmeter1, potmeter2, button] = message;
    const x = map(potmeter1, 0, 255, -1, 1);
    const y = map(potmeter2, 0, 255, -1, 1);
    vector.set(x, y)
    if (button > 0) {
      bg = "red";
    } else {
      bg = 200;
    }

    serial.write(new Uint8Array([65]));
  }
}






init();

