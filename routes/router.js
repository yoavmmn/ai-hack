const express = require('express');
const fetch = require('node-fetch');
const { MessageParser } = require('../lib/messages-parser')

const router = new express.Router();

router.get('/', (req, res) => {
  (async function () {
    let stream = await fetch('https://api.chucknorris.io/jokes/random');
    let joke = await stream.json();
    res.send(joke.value);
  }());
});

router.get('/webhook', (req, res) => {
  const token = process.env.WEBHOOK_TOKEN || '123456';

  if (req.query['hub.verify_token'] === token) {
    return res.send(req.query['hub.challenge']);
  } else {
    res.send('Invalid token');
  }
});


router.post('/webhook', (req, res) => {
  var data = req.body;

  // Make sure this is a page subscription
  if (data.object === 'page') {

    // Iterate over each entry - there may be multiple if batched
    data.entry.forEach((entry) => {
      const pageID = entry.id;
      const timeOfEvent = entry.time;

      // Iterate over each messaging event
      entry.messaging.forEach((event) => {
        if (event.message) {
          let messageParser = new MessageParser()
          messagesParser.detectMessage(event);
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
module.exports = router;
