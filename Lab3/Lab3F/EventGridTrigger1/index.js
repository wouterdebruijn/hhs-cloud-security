const Client = require("azure-iothub").Client;

const connectionString = process.env.IOTHUB_CONNECTION_STRING;
if (!connectionString) {
    console.error(
        "Please set the IOTHUB_CONNECTION_STRING environment variable.",
    );
    process.exit(-1);
}

const client = Client.fromConnectionString(connectionString);

module.exports = async function (context, eventGridEvent) {
    context.log(eventGridEvent);

    // Read the device ID and method name from the query string
    const targetDevice = "test_device_nodejs"

    const methodParams = {
        methodName: "lockDoor",
        payload: JSON.stringify({
            locked: eventGridEvent.data.body.temperature > 29,
        }),
        responseTimeoutInSeconds: 15,
    };

    try {
        // Wait for the response from the device
        const request = await client.invokeDeviceMethod(targetDevice, methodParams);

        context.log = {
            body: JSON.stringify(request.result),
        };
    } catch (error) {
        context.log = {
            status: 500,
            body: error.message,
        };
    }
};