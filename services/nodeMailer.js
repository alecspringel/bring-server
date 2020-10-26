//Node Mailer
const nodemailer = require("nodemailer");
const keys = require("../config/keys");
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: keys.EMAIL_USER,
      pass: keys.EMAIL_PW,
    },
  });
  
function sendEmail(subject, text, html=null, receiverAddr=keys.EMAIL_USER) {
    if (html){
      let info = transporter.sendMail({
        subject: subject,
        text: text,
        html: html,
        to: receiverAddr});
    } else {
    let info = transporter.sendMail({
                                    subject: subject,
                                    text: text,
                                    to: receiverAddr});
    };
    console.log(`Sent email titled "${subject}" to ${receiverAddr}`);
}

function sendStaffEmailNotification(pending, itemName, adminUrl, message) {
    const emailSubject = `${pending} pending donation questions`;
    var body = `<p>A new donation question about ${itemName} was posted.<br>There are currently <b>${pending}</b> questions waiting for review.`;
    const button = `<p><a href="http://localhost:3000/admin" target="_blank" style="font-size: 16px; font-family: Helvetica, Arial, sans-serif; color: #FFFFFF; text-decoration: none; border-radius: 3px; background-color: #de472b; border-top: 12px solid #de472b; border-bottom: 12px solid #de472b; border-right: 18px solid #de472b; border-left: 18px solid #de472b; display: inline-block;">Respond now &rarr;</a></p>`;
    body = body.concat(button);
    sendEmail(emailSubject, message, html=body);
}

module.exports = {sendEmail, sendStaffEmailNotification};