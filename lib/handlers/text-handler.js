const messageTypes = require('../factories/message-types');

function handleTextMessage(parser) {
  const event = parser.event;

  parser.sendMessage(messageTypes.TEXT, parser.message.text);
}

module.exports = handleTextMessage;
