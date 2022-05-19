int RXLED = 17; // on an Arduino Micro, PIN 17 is an onboard LED pin

void setup()
{
	pinMode(RXLED, OUTPUT);
}

void loop()
{
	digitalWrite(RXLED, HIGH);
	delay(1000);
	digitalWrite(RXLED, LOW);
	delay(1000);
	for (int i = 0; i <= 20; i++)
	{
		digitalWrite(RXLED, (i % 2 == 1) ? HIGH : LOW);
		delay(200);
	}
}
