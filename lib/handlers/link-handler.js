const messageTypes = require('../factories/message-types');

function handleLinkMessage(parser, link) {
  // Here we should handle the link
  return parser.sendMessage(messageTypes.TEXT, `Identified Link: ${link}`);
}

module.exports = handleLinkMessage;
