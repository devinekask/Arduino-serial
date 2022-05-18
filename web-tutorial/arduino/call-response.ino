void setup()
{
	Serial.begin(9600);
	while (!Serial)
		;
}

void loop()
{
	if (Serial.available())
	{
		String inputString = Serial.readString();
		inputString.toUpperCase();
		Serial.println(inputString);
	}
}
