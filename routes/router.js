const express = require('express');
const fetch = require('node-fetch');
const { MessageParser } = require('../lib/messages-parser');

const router = new express.Router();

router.get('/', (req, res) => {
  (async function callback() {
    const stream = await fetch('https://api.chucknorris.io/jokes/random');
    const joke = await stream.json();
    res.send(joke.value);
  }());
});

router.get('/webhook', (req, res) => {
  const token = process.env.WEBHOOK_TOKEN || '123456';

  if (req.query['hub.verify_token'] === token) {
    return res.send(req.query['hub.challenge']);
  }
  return res.send('Invalid token');
});


router.post('/webhook', (req, res) => {
  const data = req.body;

  // Make sure this is a page subscription
  if (data.object === 'page') {

    // Iterate over each entry - there may be multiple if batched
    data.entry.forEach(async function (entry) {
      const pageID = entry.id;
      const timeOfEvent = entry.time;

      // Iterate over each messaging event
      entry.messaging.forEach((event) => {
        if (event.message) {
          // Handle the message
          const messageParser = new MessageParser(event);
          messageParser.handle().then((response) => {
            console.log(`Response: ${response.data}`);
          }).catch((error) => {
            console.error(`ERROR: ${error.message}`);
            console.error(`DATA: ${JSON.stringify(error.response.data)}`);
            console.error(`REQUEST: ${JSON.stringify(error.request)}`);
          });

        } else {
          // This event doesn't contain any message...
          console.log('Webhook received unknown event: ', event);
        }
      });
    });

    res.sendStatus(200);
  }
});
module.exports = router;
