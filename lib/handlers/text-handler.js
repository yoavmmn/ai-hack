const messageTypes = require('../factories/message-types');
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

    return parser.sendMessage(messageTypes.TEXT, `Identified Link: ${link}`);
  }

  switch (text.toLowerCase()) {
    case 'hi':
      return parser.sendMessage(messageTypes.TEXT, WELCOME_MESSAGE);

    default:
      return parser.sendMessage(messageTypes.TEXT, DONT_UNDERSTAND_MESSAGE);
  }
}

module.exports = handleTextMessage;
