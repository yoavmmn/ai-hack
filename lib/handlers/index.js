const handleTextMessage = require('./text-handler');
const handleAttachementsMessage = require('./attachments-handler');
const handleQuickReplyMessage = require('./quick-reply-handler');

module.exports = {
  handleTextMessage,
  handleAttachementsMessage,
  handleQuickReplyMessage,
}
