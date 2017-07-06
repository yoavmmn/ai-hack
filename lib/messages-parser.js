
function detectMessage(event) {
  let senderID = event.sender.id;
  let recipientID = event.recipient.id;
  let timeOfMessage = event.timestamp;
  let message = event.message;

  console.log("Received message for user %d and page %d at %d with message:",
    senderID, recipientID, timeOfMessage);
  console.log(JSON.stringify(message));

  
}

function handleTextMessage(message) {

}

function handleImageMessage(message) {

}

module.exports = {
  detectMessage
};
