// Copyright (c) Microsoft. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

'use strict';

// Choose a protocol by uncommenting one of these transports.
const Protocol = require('azure-iot-device-mqtt').Mqtt;
// const Protocol = require('azure-iot-device-amqp').Amqp;
// const Protocol = require('azure-iot-device-http').Http;
// const Protocol = require('azure-iot-device-mqtt').MqttWs;
// const Protocol = require('azure-iot-device-amqp').AmqpWs;

const Client = require('azure-iot-device').Client;
let client = null;

let isOpen = true;
let isRedInColor = false;

function main() {
    // open a connection to the device
    const deviceConnectionString = process.env.IOTHUB_DEVICE_CONNECTION_STRING;
    client = Client.fromConnectionString(deviceConnectionString, Protocol);
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    client.open(onConnect);
}

function onConnect(err) {
    if(err) {
        console.error('Could not connect: ' + err.message);
    } else {
        console.log('Connected to device. Registering handlers for methods.');

        // register handlers for all the method names we are interested in
        client.onDeviceMethod('getDeviceLog', onGetDeviceLog);
        client.onDeviceMethod('lockDoor', onLockDoor);

        // Read desired properties
        client.getTwin((err, twin) => {
            if (err) {
                console.error('Could not get twin');
            } else {
                twin.on('properties.desired', (desiredChange) => {
                    isRedInColor = desiredChange.isRedInColor;

                    // Report the device state
                    twin.properties.reported.update({ isRedInColor }, (err) => console.log(err ? 'Error updating reported properties' : 'Reported properties updated'));
                });
            }
        });
    }
}

function onGetDeviceLog(request, response) {
    printDeviceMethodRequest(request);

    // Implement actual logic here.
    const payload = {
        isOpen
    };

    // complete the response
    response.send(200, JSON.stringify(payload), function (err) {
        if(err) {
            console.error('An error ocurred when sending a method response:\n' +
                err.toString());
        } else {
            console.log('Response to method \'' + request.methodName +
                '\' sent successfully.' );
        }
    });
}

function onLockDoor(request, response) {
    printDeviceMethodRequest(request);

    const payload = JSON.parse(request.payload);

    // Implement actual logic here.
    isOpen = !payload.locked;

    response.send(200, isOpen ? "Door is unlocked" : "Door is now locked", function (err) {
        if(err) {
            console.error('An error ocurred when sending a method response:\n' +
                err.toString());
        } else {
            console.log('Response to method \'' + request.methodName +
                '\' sent successfully.' );
        }
    });
}

function printDeviceMethodRequest(request) {
    // print method name
    console.log('Received method call for method \'' + request.methodName + '\'');

    // if there's a payload just do a default console log on it
    if(request.payload) {
        console.log('Payload:\n' + request.payload);
    }
}

// get the app rolling
main();
