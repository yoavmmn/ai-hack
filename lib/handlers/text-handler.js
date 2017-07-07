const messageTypes = require('../factories/message-types');
const { handleLinkMessage } = require('./');
const { WELCOME_MESSAGE, DONT_UNDERSTAND_MESSAGE } = require('../../config');

function handleTextMessage(parser) {
  console.log(`Text: ${parser.message.text}`);

  const event = parser.event;
  const text = parser.message.text;

  // Checking if there is a URL in the text
  const re = new RegExp(/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig);
  const results = re.exec(text);

  if (results) {
    const link = results[0];

    return handleLinkMessage(parser, link);
  }

  // Switching by the first word
  switch (text.toLowerCase().split(' ')[0]) {
    case 'hi':
    case 'hello':
      return parser.sendMessage(messageTypes.TEXT, WELCOME_MESSAGE);

    case 'welcome':
      return parser.sendMessage(messageTypes.TEXT, 'Are you saying welcome to me?');

    default:
      return parser.sendMessage(messageTypes.TEXT, DONT_UNDERSTAND_MESSAGE);
  }
}

module.exports = handleTextMessage;
