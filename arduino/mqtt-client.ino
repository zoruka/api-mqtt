#include <SPI.h>
#include <Ethernet.h>
#include <PubSubClient.h>

#define RELE 2



// Function prototypes
void subscribeReceive(char* topic, byte* payload, unsigned int length);

// Set your MAC address and IP address here
byte mac[] = { 0xDE, 0xAD, 0xBE, 0xEF, 0xFE, 0xED };
IPAddress ip(192, 168, 5, 113);

// Make sure to leave out the http and slashes!
const char* server = "192.168.5.178";

// Ethernet and MQTT related objects
EthernetClient ethClient;
PubSubClient mqttClient(ethClient);

void setup()
{

  pinMode(RELE, OUTPUT);
  digitalWrite(RELE, HIGH);
  // Useful for debugging purposes
  Serial.begin(9600);

  // Start the ethernet connection
  Ethernet.begin(mac, ip);

  // Ethernet takes some time to boot!
  delay(3000);

  // Set the MQTT server to the server stated above ^
  mqttClient.setServer(server, 1883);

  // Attempt to connect to the server with the ID "adruino-client"
  if (mqttClient.connect("adruino-client"))
  {
    Serial.println("Connection has been established, well done");

    // Establish the subscribe event
    mqttClient.setCallback(subscribeReceive);
  }
  else
  {
    Serial.println("Looks like the server connection faiRELE...");
  }
}


void loop()
{
  // This is needed at the top of the loop!
  mqttClient.loop();

  // Ensure that we are subscribed to the topic "state"
  mqttClient.subscribe("state");

  // Attempt to publish a value to the topic "current-value"
  char buf[3];
  if (mqttClient.publish("current-value", itoa(random(118, 135), buf, 10)))
  {
    Serial.println("Publish message success");
  }
  else
  {
    Serial.println("Could not send message :(");
  }

  // Dont overload the server!
  delay(1000);
}


void subscribeReceive(char* topic, byte* payload, unsigned int length)
{
  // Print the topic
  Serial.print("Topic: ");
  Serial.println(topic);

  // Print the message
  Serial.print("Message: ");
  for (int i = 0; i < length; i ++)
  {
    Serial.print(char(payload[i]));

    if (payload[0] == '0') {
      digitalWrite(RELE, HIGH);

    } else if (payload[0] == '1') {
      digitalWrite(RELE, LOW);
    }
  }



  // Print a newline
  Serial.println("");
}
