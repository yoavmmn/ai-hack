const messageTypes = require('../factories/message-types');
const runtimeDatabase = require('../runtime-database');

function handleLinkMessage(parser, link) {
  // Here we should handle the link
  runtimeDatabase.updateUrl(parser.senderId, link);
  return parser.sendMessage(messageTypes.TEXT, `Identified Link: ${link}.\n/
    Please enter a description.`);
}

module.exports = handleLinkMessage;
