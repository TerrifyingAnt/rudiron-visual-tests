setup() {
pinMode(5, OUTPUT);
}

loop() {
digitalWrite(5, HIGH);
delay(100);
digitalWrite(5, LOW);
delay(1000);
// Не выбраны операнды
}