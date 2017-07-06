const handlers = require('./handlers');

class MessageParser {
  constructor(event) {
    this.event = event;
    this.message = event.message;

    if (this.message.text) {
      this.type = "text";
    }
    else if (this.message.attachments) {
      this.type = "attachments";
    } else if (this.message.quick_reply) {
      this.type = "quick_reply";
    } else {
      this.type = "unknown";
    }

    console.log(`Got message: ${JSON.stringify(this.message)}`);
  }

  handleText() {
    handlers.handleTextMessage(this.event);
  }

  handleAttachments() {
    handlers.handleAttachementsMessage(this.event);
  }

  handleQuickReply() {
    handlers.handleQuickReplyMessage(this.event);
  }

  handle() {
    switch (this.type) {
      case "text":
        this.handleText();
        break;

      case "attachments":
        this.handleAttachments();
        break;

      case "quick_reply":
        this.handleQuickReply();
        break;

      default:
        return;
    }
  }

}

module.exports = {
  MessageParser,
};