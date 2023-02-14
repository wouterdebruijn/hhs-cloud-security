Functionality split into seperate files. Which makes it possible to run multiple lamp instances listening to the same motion sensor.

The actual code is the same as Lab1C/example1

If the motion sensors contain the timeout, there needs to be additional logic to handle multiple motion sensors, if the lamp contain the timeout. The timeout needs to reset on every on event. Like I did for this lab.

The lamp could have its own MQTT topic requiring some middleware to handle sensor input and  lamp output.  Right now most logic is in the lamp part to keep power consumtion in the (possibly) battery powered sensor lower.