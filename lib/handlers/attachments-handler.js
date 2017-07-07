function handleAttachementsMessage(parser) {
  console.log(`Attachment: ${parser.message.attachments}`);

  const event = parser.event;
}

module.exports = handleAttachementsMessage;
