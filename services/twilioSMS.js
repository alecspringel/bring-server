const keys = require("../config/keys");

const twilioAccountSid = keys.TWILIO_SECURE_IDENTIFIER
const twilioAuthToken = keys.TWILIO_AUTH_TOKEN
const client = require('twilio')(twilioAccountSid, twilioAuthToken)
const senderPhoneNumber = "+12059534885";


module.exports = function sendSMS(receiverPhoneNumber, message) {
    client.messages
    .create({
        body: message,
        from: senderPhoneNumber,
        to: receiverPhoneNumber,
    })
    .then(message => console.log(message));
}