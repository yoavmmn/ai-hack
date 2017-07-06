const messageTypes = require('./message-types');

class Message {
  constructor(type, text, attachment, quickReplies) {
    this.type = type;
    this.text = text;
    this.attachment = attachment;
    this.quick_replies = quickReplies;
  }

  toJson() {
    switch (this.type) {
      case messageTypes.TEXT:
        return {
          text: this.text,
        };

      case messageTypes.ATTACHMENTS:
        return {
          attachment: this.attachment,
        };

      case messageTypes.QUICK_REPLY:
        return {
          quick_replies: this.quickReplies,
        };

      default:
        return {
          text: 'There was something unexpected...',
        };
    }
  }
}

function generateMessage(type, property) {
  switch (type) {
    case messageTypes.TEXT:
      return new Message(type, property, null, null);

    case messageTypes.ATTACHMENTS:
      return new Message(type, null, property, null);

    case messageTypes.QUICK_REPLY:
      return new Message(type, null, null, property);
    default:
      return null;
  }
}

module.exports = generateMessage;
