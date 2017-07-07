const handleTextMessage = require('./text-handler');
const handleAttachementsMessage = require('./attachments-handler');
const handleQuickReplyMessage = require('./quick-reply-handler');
const handleLinkMessage = require('./link-handler');

module.exports = {
  handleTextMessage,
  handleAttachementsMessage,
  handleQuickReplyMessage,
  handleLinkMessage,
};
