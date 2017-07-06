const express = require('express');
const fetch = require('node-fetch');

const router = new express.Router();

router.get('/', (req, res) => {
  const joke = await fetch('https://api.chucknorris.io/jokes/random');
  res.send(joke.body);
});

router.get('/webhook', (req, res) => {
  const token = process.env.WEBHOOK_TOKEN || '123456';

  if (req.query['hub.verify_token'] === token) {
    res.send(req.query['hub.challenge']);
  } else {
    res.send('Invalid token');
  }
});

module.exports = router;
