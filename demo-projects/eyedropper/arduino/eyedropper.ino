int red_light_pin = 3;
int green_light_pin = 5;
int blue_light_pin = 10;
void setup()
{
  pinMode(red_light_pin, OUTPUT);
  pinMode(green_light_pin, OUTPUT);
  pinMode(blue_light_pin, OUTPUT);

  Serial.begin(9600);
  while (!Serial)
    ;
}

void loop()
{
  if (Serial.available())
  {
    byte red = Serial.read();
    byte green = Serial.read();
    byte blue = Serial.read();
    RGB_color(red, green, blue);
  }
}

void RGB_color(byte red_light_value, byte green_light_value, byte blue_light_value)
{
  analogWrite(red_light_pin, red_light_value);
  analogWrite(green_light_pin, green_light_value);
  analogWrite(blue_light_pin, blue_light_value);

  Serial.write(red_light_value);
  Serial.write(green_light_value);
  Serial.write(blue_light_value);
}
