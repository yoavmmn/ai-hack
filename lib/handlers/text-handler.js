const messageTypes = require('../factories/message-types');

function handleTextMessage(parser) {
  console.log(`Text: ${parser.message.text}`);

  const event = parser.event;

  return parser.sendMessage(messageTypes.TEXT, parser.message.text);
}

module.exports = handleTextMessage;
