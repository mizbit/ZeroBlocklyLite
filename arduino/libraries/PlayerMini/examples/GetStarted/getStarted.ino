#include "Arduino.h"
#include "SoftwareSerial.h"
#include "PlayerMini.h"
#include    "ZeroWorkshop_Macro_Definitions.h"
#include    "ZeroWorkshop_lib.h"
SoftwareSerial mySoftwareSerial(A1, A0); // RX, TX
PlayerMini myPlayer;
void printDetail(uint8_t type, int value);

void setup()
{
  mySoftwareSerial.begin(9600);
  Serial.begin(115200);
  
  Serial.println();
  Serial.println(F("Player Mini Demo"));
  Serial.println(F("Initializing Player ... (May take 3~5 seconds)"));
  
  if (!myPlayer.begin(mySoftwareSerial)) {  //Use softwareSerial to communicate with mp3.
    Serial.println(F("Unable to begin:"));
    Serial.println(F("1.Please recheck the connection!"));
    Serial.println(F("2.Please insert the SD card!"));
    while(true){
      delay(0); // Code to compatible with ESP8266 watch dog.
    }
  }
  Serial.println(F("Player Mini online."));
  
  myPlayer.volume(10);  //Set volume value. From 0 to 30
  myPlayer.play(1);  //Play the first mp3
}

void loop()
{
  static unsigned long timer = millis();
  
  if (millis() - timer > 3000) {
    timer = millis();
    myPlayer.next();  //Play next mp3 every 3 second.
  }
  
  if (myPlayer.available()) {
    printDetail(myPlayer.readType(), myPlayer.read()); //Print the detail message from DFPlayer to handle different errors and states.
  }
}

void printDetail(uint8_t type, int value){
  switch (type) {
    case TimeOut:
      Serial.println(F("Time Out!"));
      break;
    case WrongStack:
      Serial.println(F("Stack Wrong!"));
      break;
    case PlayerCardInserted:
      Serial.println(F("Card Inserted!"));
      break;
    case PlayerCardRemoved:
      Serial.println(F("Card Removed!"));
      break;
    case PlayerCardOnline:
      Serial.println(F("Card Online!"));
      break;
    case PlayerUSBInserted:
      Serial.println("USB Inserted!");
      break;
    case PlayerUSBRemoved:
      Serial.println("USB Removed!");
      break;
    case PlayerPlayFinished:
      Serial.print(F("Number:"));
      Serial.print(value);
      Serial.println(F(" Play Finished!"));
      break;
    case PlayerError:
      Serial.print(F("PlayerError:"));
      switch (value) {
        case Busy:
          Serial.println(F("Card not found"));
          break;
        case Sleeping:
          Serial.println(F("Sleeping"));
          break;
        case SerialWrongStack:
          Serial.println(F("Get Wrong Stack"));
          break;
        case CheckSumNotMatch:
          Serial.println(F("Check Sum Not Match"));
          break;
        case FileIndexOut:
          Serial.println(F("File Index Out of Bound"));
          break;
        case FileMismatch:
          Serial.println(F("Cannot Find File"));
          break;
        case Advertise:
          Serial.println(F("In Advertise"));
          break;
        default:
          break;
      }
      break;
    default:
      break;
  }
  
}
