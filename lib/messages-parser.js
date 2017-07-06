const axios = require('axios');

const messageTypes = require('./factories/message-types');
const handlers = require('./handlers');
const factories = require('./factories');

const { PAGE_ACCESS_TOKEN } = require('../config');

class MessageParser {
  constructor(event) {
    this.event = event;
    this.message = event.message;
    this.senderId = event.sender.id;

    if (this.message.text) {
      this.type = messageTypes.TEXT;
    } else if (this.message.attachments) {
      this.type = messageTypes.ATTACHMENTS;
    } else if (this.message.quick_reply) {
      this.type = messageTypes.QUICK_REPLY;
    } else {
      this.type = 'unknown';
    }

    console.log(`Got message ${JSON.stringify(this.message)} from ${this.senderId}`);
  }

  handleText() {
    handlers.handleTextMessage(this);
  }

  handleAttachments() {
    handlers.handleAttachementsMessage(this);
  }

  handleQuickReply() {
    handlers.handleQuickReplyMessage(this);
  }

  handle() {
    switch (this.type) {
      case messageTypes.TEXT:
        this.handleText();
        break;

      case messageTypes.ATTACHMENTS:
        this.handleAttachments();
        break;

      case messageTypes.QUICK_REPLY:
        this.handleQuickReply();
        break;

      default:
        break;
    }
  }

  sendMessage(type, messageProperty) {
    const recipient = this.event.sender.id;
    const message = factories.generateMessage(type, messageProperty);
    return axios.post(`https://graph.facebook.com/v2.6/me/messages?accessToken=${PAGE_ACCESS_TOKEN}`, {
      recipient: {
        id: recipient,
      },
      message,
    });
  }

}

module.exports = {
  MessageParser,
};
