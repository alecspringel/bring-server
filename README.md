# Bring Recycling Server
## Overview
This Node server is responsible for responding to API requests made by the react front end of the project (available [here](https://github.com/alecspringel/bring-client), processing and storing uploaded images in AWS S3, and storing and retrieving donation data from a MongoDB database.

Additionally, the server also uses Slack's API to communicate with staff and Twilio's API to send SMS messages to potential donators.

## Setup

### keys.js File Setup
Many parts of this application require additional API keys,passwords, and tokens, which the application expects to come from a keys.js file in the config folder. You'll need to create you're own. For an example of how to structure it, and everything that needs to be in it check out the file exampleKeys.js in the config folder.

### SMS Setup

In order to send text messages to potential donators, this project uses Twilio's API. You'll need to create a Twilio account and get a phone number capable of sending text messages, then add the account sid and auth tokens to the /config/keys.js file.
Note: There is a small cost associated with sending SMS messages with Twilio, however it should be very affordable at less than 1 cent to per message.

### Slack Integration

In order to notify staff members via Slack whenever someone submits a donation question, follow the steps outlined [here](https://api.slack.com/messaging/webhooks) to create a new slack app, add it to your workspace, and create a webhook for that app. Save the webhook URL to the config/keys.js file.

### Email Setup

By default this application is set up to send emails from a gmail account. If this works for you, all you have to do is add the username and password of the gmail account to the config/keys.js file. If you'd like to use a non-gmail email account, you'll need to modify the services/nodeMailer.js file based on the nodemailer docs found [here](https://nodemailer.com/about/).

### AWS Setup 

This application stores any user submitted images in an AWS S3 bucket. To setup bucket do: FIX ME

### MongoDB Setup

In order for staff to respond to questions about donating items, the server stores contact information of potential donators in a MongoDB database along with item information.

To setup mongodb do: FIX ME
