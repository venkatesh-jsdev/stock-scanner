const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const request = require('request');
// let bot = new Bot({
//   token: 'EAAHeoBZAYDSABAAvYYptm9eHrk9jXVZAYa615OUO3UD1T0r3wZBhS9KPumKpdlZCXU3yLf9m4lLWPZA8uWA0fW90vuB6nVz1fg6PyJMkZB5dMNQFZCri55lER3724ZCiVEMmIEQnbtwD6qfMEfpinuS5J3RzHSY6QBBqw72OgZC8kVzcK1DSf0nxZA',
//   verify: 'VERIFY_TOKEN'
// })

var app = new express();
var port = process.env.PORT || 3000;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.get('/webhook', function(req, res) {
  console.log("in webhook");
  if (req.query['hub.mode'] === 'subscribe' &&
      req.query['hub.verify_token'] === 'VERIFY_TOKEN') {
    console.log("Validating webhook");
    res.status(200).send(req.query['hub.challenge']);
  } else {
    console.error("Failed validation. Make sure the validation tokens match.");
    res.sendStatus(403);
  }
});

app.post('/webhook', function (req, res) {
  var data = req.body;

  // Make sure this is a page subscription
  if (data.object === 'page') {

    // Iterate over each entry - there may be multiple if batched
    data.entry.forEach(function(entry) {
      var pageID = entry.id;
      var timeOfEvent = entry.time;

      // Iterate over each messaging event
      entry.messaging.forEach(function(event) {
        if (event.message) {
          receivedMessage(event);
        } else {
          console.log("Webhook received unknown event: ", event);
        }
      });
    });

    // Assume all went well.
    //
    // You must send back a 200, within 20 seconds, to let us know
    // you've successfully received the callback. Otherwise, the request
    // will time out and we will keep trying to resend.
    res.sendStatus(200);
  }
});

function receivedMessage(event) {
  // Putting a stub for now, we'll expand it in the following steps
  console.log("Message data: ", event.message);
}

function receivedMessage(event) {
  var senderID = event.sender.id;
  var recipientID = event.recipient.id;
  var timeOfMessage = event.timestamp;
  var message = event.message;

  console.log("Received message for user %d and page %d at %d with message:",
    senderID, recipientID, timeOfMessage);
  console.log(JSON.stringify(message));

  var messageId = message.mid;

  var messageText = message.text;
  var messageAttachments = message.attachments;

  if (messageText) {

    // If we receive a text message, check to see if it matches a keyword
    // and send back the example. Otherwise, just echo the text we received.
    switch (messageText) {
      case 'generic':
        sendGenericMessage(senderID);
        break;

      default:
        sendTextMessage(senderID, messageText);
    }
  } else if (messageAttachments) {
    sendTextMessage(senderID, "Message with attachment received");
  }
}

function sendGenericMessage(recipientId, messageText) {
  // To be expanded in later sections
}

function sendTextMessage(recipientId, messageText) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      text: messageText
    }
  };

  callSendAPI(messageData);
}

function callSendAPI(messageData) {
  request({
    uri: 'https://graph.facebook.com/v2.6/me/messages',
    qs: { access_token: "EAAHeoBZAYDSABACuV33g5AJZBbEv8O9tVAdSdTINk4azIjc7CpXFq1ZCgcPZACfUZBEDZAdj7NFMJ5ZBZAOg3xQTZCLebwWHowapzwzax4em1Q7J9M68Gw7l8nhIA0aXUIfdGkJZCaIIcp5xc1Azi5gyTUcZC3dK2n6MCEZAX0x2eGkEZCbI4hv4PL0ET" },
    method: 'POST',
    json: messageData

  }, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var recipientId = body.recipient_id;
      var messageId = body.message_id;

      console.log("Successfully sent generic message with id %s to recipient %s",
        messageId, recipientId);
    } else {
      console.error("Unable to send message.");
      console.error(response);
      console.error(error);
    }
  });
}

// bot.on('error', (err) => {
//   console.log(err.message)
// })
//
// bot.on('message', (payload, reply) => {
//   let text = payload.message.text
//
//   bot.getProfile(payload.sender.id, (err, profile) => {
//     if (err) throw err
//
//     reply({ text }, (err) => {
//       if (err) throw err
//
//       console.log(`Echoed back to ${profile.first_name} ${profile.last_name}: ${text}`)
//     })
//   })
// })

// Define the port to run on
app.set('port', port);
app.use('/', express.static(path.join(__dirname, 'public')));
app.listen(port,function() {
  console.log("App running on "+ port);
});
