const twilioAccountSid = process.env.TWILIO_SECURE_IDENTIFIER;
const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(twilioAccountSid, twilioAuthToken);
const senderPhoneNumber = process.env.TWILIO_PHONE_NUMBER;


module.exports = function sendSMS(receiverPhoneNumber, message) {
  client.messages
    .create({
      body: message,
      from: senderPhoneNumber,
      to: receiverPhoneNumber,
    })
    .then((message) => console.log(message));
};
