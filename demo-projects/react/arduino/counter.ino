const int buttonPin = 2;
const int ledPin = 17;

const byte pins[] = {21, 20, 19, 18};

int buttonValue = 0;
int inByte = 0;

void setup()
{
  // start serial port at 9600 bps:
  Serial.begin(9600);

  pinMode(buttonPin, INPUT); // digital sensor is on digital pin 2
  pinMode(ledPin, OUTPUT);

  for (byte i = 0; i < 4; i++)
  {
    pinMode(pins[i], OUTPUT);
  }
}

void loop()
{
  if (Serial.available())
  {
    byte num = Serial.read();
    for (byte i = 0; i < 4; i++)
    {
      byte state = bitRead(num, i);
      digitalWrite(pins[i], state);
    }
  }

  // read switch, map it to 0 or 255L
  buttonValue = map(digitalRead(buttonPin), 0, 1, 0, 255);
  if (buttonValue == 255)
  {
    // send sensor values:
    Serial.write(buttonValue);
    digitalWrite(ledPin, HIGH);
    delay(100);
    digitalWrite(ledPin, LOW);
    delay(50);
  }

  delay(50);
}
