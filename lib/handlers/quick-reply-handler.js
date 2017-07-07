function handleQuickReplyMessage(parser) {
  console.log(`Quick Replies: ${parser.message.quick_replies}`);

  const event = parser.event;
}

module.exports = handleQuickReplyMessage;
