/*

  Serial Call and Response
  Language: Wiring/Arduino
  This program sends an ASCII A (byte of value 65) on startup and repeats that
  until it gets some data in. Then it waits for a byte in the serial port, and
  sends three sensor values whenever it gets a byte in.

  The circuit:
  - potentiometers attached to analog inputs 0 and 1
  - pushbutton attached to digital I/O 2

  created 26 Sep 2005
  by Tom Igoe
  modified 24 Apr 2012
  by Tom Igoe and Scott Fitzgerald
  Thanks to Greg Shakar and Scott Fitzgerald for the improvements
  This example code is in the public domain.
  http://www.arduino.cchttps://www.arduino.cc/en/Tutorial/SerialCallResponse

*/

const int buttonPin = 2;
const int firstPotPin = A6;
const int secondPotPin = A7;

int buttonValue = 0;
int firstPotValue = 0;
int secondPotValue = 0;
int inByte = 0;

void setup()
{
  // start serial port at 9600 bps:
  Serial.begin(9600);

  pinMode(buttonPin, INPUT); // digital sensor is on digital pin 2
  establishContact();        // send a byte to establish contact until receiver responds
}

void loop()
{
  // if we get a valid byte, read analog ins:
  if (Serial.available() > 0)
  {
    // get incoming byte:
    inByte = Serial.read();

    // read first analog input, divide by 4 to make the range 0-255:
    firstPotValue = analogRead(firstPotPin) / 4;

    // delay 10ms to let the ADC recover:
    delay(10);

    // read second analog input, divide by 4 to make the range 0-255:
    secondPotValue = analogRead(secondPotPin) / 4;

    // read switch, map it to 0 or 255L
    buttonValue = map(digitalRead(buttonPin), 0, 1, 0, 255);

    // send sensor values:
    Serial.write(firstPotValue);
    Serial.write(secondPotValue);
    Serial.write(buttonValue);
  }
}

void establishContact()
{
  while (Serial.available() <= 0)
  {
    Serial.print('A'); // send a capital A
    delay(300);
  }
}
