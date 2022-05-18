/*
  State change detection (edge detection)

  Often, you don't need to know the state of a digital input all the time, but
  you just need to know when the input changes from one state to another.
  For example, you want to know when a button goes from OFF to ON. This is called
  state change detection, or edge detection.

  This example shows how to detect when a button or button changes from off to on
  and on to off.

  The circuit:
  - pushbutton attached to pin 2 from +5V
  - 10 kilohm resistor attached to pin 2 from ground
  - LED attached from pin 13 to ground through 220 ohm resistor (or use the
    built-in LED on most Arduino boards)

  created  27 Sep 2005
  modified 30 Aug 2011
  by Tom Igoe

  This example code is in the public domain.

  https://www.arduino.cc/en/Tutorial/BuiltInExamples/StateChangeDetection
*/

// this constant won't change:
const int buttonPin = 2; // the pin that the pushbutton is attached to
const int ledPin = 17;   // the pin that the LED is attached to

const int xAxisPin = 3;
// const int yAxisPin = 4;
// const int switchPin = 5;

// Variables will change:
int buttonState = 0;     // current state of the button
int lastButtonState = 0; // previous state of the button
int xAxisValue = 0;
// int yAxisValue = 0;
// int switchState = 0;
// int lastSwitchState = 0;

bool buttonClicked = false;

const int numReadings = 10;
int readings[numReadings]; // the readings from the analog input
int readIndex = 0;         // the index of the current reading
int total = 0;             // the running total
int average = 0;           // the average

void setup()
{
  // initialize the button pin as a input:
  pinMode(buttonPin, INPUT);
  // initialize the LED as an output:
  pinMode(ledPin, OUTPUT);
  // initialize serial communication:
  Serial.begin(9600);

  for (int thisReading = 0; thisReading < numReadings; thisReading++)
  {
    readings[thisReading] = 0;
  }
}

void loop()
{
  // read the pushbutton input pin:
  buttonState = digitalRead(buttonPin);
  switchState = digitalRead(switchPin);

  xAxisValue = analogRead(xAxisPin);
  // yAxisValue = analogRead(yAxisPin);

  // subtract the last reading:
  total = total - readings[readIndex];
  // read from the sensor:
  readings[readIndex] = analogRead(xAxisPin);
  // add the reading to the total:
  total = total + readings[readIndex];
  // advance to the next position in the array:
  readIndex = readIndex + 1;

  // if we're at the end of the array...
  if (readIndex >= numReadings)
  {
    // ...wrap around to the beginning:
    readIndex = 0;
  }

  // calculate the average:
  average = total / numReadings;

  // compare the buttonState to its previous state
  if (buttonState != lastButtonState)
  {
    // if the state has changed, increment the counter
    if (buttonState == HIGH)
    {
      buttonClicked = true;
    }
    else
    {
      buttonClicked = false;
    }
  }

  Serial.print(average);
  Serial.print("-");
  Serial.print(buttonClicked);
  Serial.println("");
  // save the current state as the last state, for next time through the loop
  lastButtonState = buttonState;
  delay(50); // delay in between reads for stability
}
