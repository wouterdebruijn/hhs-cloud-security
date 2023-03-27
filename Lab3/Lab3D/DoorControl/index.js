const Client = require("azure-iothub").Client;

const connectionString = process.env.IOTHUB_CONNECTION_STRING;
if (!connectionString) {
  console.error(
    "Please set the IOTHUB_CONNECTION_STRING environment variable.",
  );
  process.exit(-1);
}

const client = Client.fromConnectionString(connectionString);

const doors = [
  {
    id: 1,
    device: "test_device_nodejs",
  },
];

module.exports = async function (context, req) {
  // Read the device ID and method name from the query string
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
};
