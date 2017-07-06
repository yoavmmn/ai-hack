const messageTypes = require('../factories/message-types');

async function handleTextMessage(parser) {
  const event = parser.event;

  await parser.sendMessage(messageTypes.TEXT, parser.message.text);
}

module.exports = handleTextMessage;
