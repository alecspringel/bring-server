# Bring Recycling Server

This project is part of the 2020 Hack For A Cause, where teams implement solutions for local non profits in 72 hours.

Please also visit the corresponding client for this project [bring-client](https://github.com/alecspringel/bring-client).

BRING Reycling is a 501(c)(3) non-profit in Eugene, OR responsible for collecting and redistributing recyclable/reusable donations ranging from building materials, furniture, appliances, hardware, and so much more.

## Overview

This Node server is responsible for responding to API requests made by the react front end, processing and storing uploaded images in AWS S3, and storing and retrieving donation data from a MongoDB database.

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

The server relies on AWS S3 to upload and host images. To set up AWS S3, got to [AWS](https://aws.amazon.com/) and create a public S3 bucket. Generate a connection key and key ID for the bucket, and record the name of the bucket. Input these values into /config/keys.js.

### MongoDB Setup

In order to set up MongoDB, input your URI connection string to /config/keys.js

## Developing
bring-client is built with React.  

#### Install
```
npm install
```
#### Run
```
npm run start
```
#### Build
```
npm run build
```

## Contributors

<table>
  <tr>
  <td align="center"><a href="https://github.com/sampeters747"><img src="https://avatars1.githubusercontent.com/u/34805699?s=460&v=4" width="100px;" alt=""/><br /><sub><b>Sam Peters</b></sub></a><br /></td>
    <td align="center"><a href="http://www.alecspringel.com"><img src="https://avatars2.githubusercontent.com/u/58418733?s=460&u=2c376b48a639dd67bf354de5ae504fc249a434c4&v=4" width="100px;" alt=""/><br /><sub><b>Alec Springel</b></sub></a><br /></td>
    </tr>
</table>
