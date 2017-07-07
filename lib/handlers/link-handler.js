const messageTypes = require('../factories/message-types');
const runtimeDatabase = require('../runtime-database');
const { questions, askQuestion } = require('../questions-manager');

function handleLinkMessage(parser, link) {
  // Here we should handle the link
  runtimeDatabase.updateUrl(parser.event.sender.id, link);
  return askQuestion(questions.DESC_QUESTION, parser);
}

module.exports = handleLinkMessage;
