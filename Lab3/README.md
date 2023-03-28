# Lab3

# Lab 3A
Ik heb een Azure function gemaakt die via een MQTT client het eerder gemaakte alarm aanroept.

```js
const mqtt = require("mqtt");

const lamps = [
  {
    mqtt: "mqtt://broker.hivemq.com",
    topic: "wouter-test-topic/alarm-lamp",
    id: 1,
  },
];

module.exports = async function (context, req) {
  context.log("JavaScript HTTP trigger function processed a request.");

  const id = +req.params.id ?? 1;

  const lamp = lamps.find((lamp) => lamp.id == id);

  if (!lamp) {
    context.res = {
      status: 404,
      body: `Alarm lamp ${id} not found`,
    };
    return;
  }

  const client = mqtt.connect(lamp.mqtt);

  client.on("connect", () => {
    client.publish(
      lamp.topic,
      JSON.stringify(req.body),
    );
    client.end();
  });

  context.res = {
    // status: 200, /* Defaults to 200 */
    body: `Alarm lamp ${lamp.id} is ${req.body?.state}`,
  };
};
```

Na het publiseren naar Azure was het ook nodig om een "code" param mee te geven. Ik vermoed dat dit een standaard beveiliging is voor Put/Post methodes.

`https://httpexamplealarmwouter.azurewebsites.net/api/alarm/1?code=somesecurecodegeneratedbyazure`


# Lab3B
Omdat de client dan aangepast moet worden wanneer er iets met de lamp veranderd. Je wilt de client API pretty houden. De Azure functions dienen als een facade.

# Lab3C
Dit kan, in de Azure function zou ik de Azure SDK toevoegen om de devices aan te sturen. Dit kan allemaal geregeld worden in de Azure function, hierdoor heeft de client geen aanpassingen nodig.

# Lab3D
Ik heb een nieuwe functie gemaakt die via de "azure-iothub" package mijn eerder gemaakte device zijn direct method aanroept. Net zoals bij de eerdere opdracht heb ik een array gebruikt op de devices in op te slaan, hierna wordt er door middel van een ID een device geselecteerd en aangeroepen. Ook heb ik gebruik gemaakt van de async functionaliteit om op een antwoord te wachten en deze naar de gebruiker terug te sturen.

```javascript
const targetDevice =
  doors.find((d) => d.id == parseInt(req.params.id)).device;

const methodParams = {
  methodName: "lockDoor",
  payload: JSON.stringify({
    locked: req.body.locked,
  }),
  responseTimeoutInSeconds: 15,
};

try {
  // Wait for the response from the device
  const request = await client.invokeDeviceMethod(targetDevice, methodParams);

  context.res = {
    body: JSON.stringify(request.result),
  };
} catch (error) {
  context.res = {
    status: 500,
    body: error.message,
  };
}
```

# Lab3E
Dit werkt, ook de tweede functie is beschikbaar via Azure.
https://httpexampledoor.azurewebsites.net/api/door/:id

Hierbij is net zoals hiervoor een code param nodig als authenticatie. Het maakt niet uit of dit vanaf mijn laptop wordt verstuurd of vanaf een andere laptop.

# Lab3F
Ik heb een Event grid trigger gemaakt en daarbij een event subscription toegevoegd.

# Lab3H
In heb een subscription gemaakt waarbij er gekeken wordt of  de temperatuur hoger is dan 25.

# Lab3J
Ik heb de trigger aangepast zodat deze de eerder gemaakte device aanroep logica van D gebruikt om de deur open en dicht te zetten.