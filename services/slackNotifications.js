const axios = require("axios");
const webhookURL = process.env.SLACK_WEBHOOK_URL;
module.exports = function sendSlackNotification(message) {
    axios.post(webhookURL, {
        text: message,
    })
    .then(function (response) {
        //console.log(response);
    })
    .catch(function (error) {
        console.log(error);
    });
}