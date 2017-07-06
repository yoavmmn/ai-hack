const express = require('express');
const fetch = require('node-fetch');
const messagesParser = require('../lib/messages-parser');

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
  const message = req.body.message;
  const text = message.text;

  messagesParser.detectMessage(message);
});
module.exports = router;
