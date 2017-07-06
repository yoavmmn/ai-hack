function detectMessage(event) {
  const message = event.message;
  console.log(JSON.stringify(message));
}

function handleTextMessage(message) {

}

function handleImageMessage(message) {

}

module.exports = {
  detectMessage
};
