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
    return handlers.handleTextMessage(this);
  }

  handleAttachments() {
    return handlers.handleAttachementsMessage(this);
  }

  handleQuickReply() {
    return handlers.handleQuickReplyMessage(this);
  }

  handle() {
    switch (this.type) {
      case messageTypes.TEXT:
        return this.handleText();

      case messageTypes.ATTACHMENTS:
        return this.handleAttachments();

      case messageTypes.QUICK_REPLY:
        return this.handleQuickReply();

      default:
        return null;
    }
  }

  sendMessage(type, messageProperty) {
    const recipient = this.senderId;
    const message = factories.generateMessage(type, messageProperty);

    console.log(JSON.stringify(message.toJson()));
    return axios.post(`https://graph.facebook.com/v2.6/me/messages?accessToken=${PAGE_ACCESS_TOKEN}`, {
      recipient: {
        id: recipient,
      },
      message: message.toJson(),
    });
  }

}

module.exports = {
  MessageParser,
};
