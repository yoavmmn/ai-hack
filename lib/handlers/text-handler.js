const messageTypes = require('../factories/message-types');
const handleLinkMessage = require('./link-handler');
const { nextQuestionToAsk, questionTypes, askQuestion, askNextQuestion } = require('../questions-manager');
const { WELCOME_MESSAGE, DONT_UNDERSTAND_MESSAGE } = require('../../config');

const runtimeDatabase = require('../runtime-database');

function handleTextMessage(parser) {
  console.log(`Text: ${parser.message.text}`);

  const event = parser.event;
  const text = parser.message.text;

  const user = runtimeDatabase.getUser(parser.senderId);
  if (!user) {
    runtimeDatabase.addUser(parser.senderId);
    return parser.sendMessage(messageTypes.TEXT, WELCOME_MESSAGE);
  }

  // Checking if there is a URL in the text
  const re = new RegExp(/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig);
  const results = re.exec(text);

  if (results) {
    const link = results[0];

    return handleLinkMessage(parser, link);
  }

  if (user.askedQuestion) {
    switch (user.askedQuestion.type) {
      case questionTypes.DESC_QUESTION:
        runtimeDatabase.updateDesc(user.id, text);
        let question = nextQuestionToAsk(user);
        return askQuestion(question, parser);

      case questionTypes.SURE_ABOUT_DESC_QUESTION:
        const firstWord = text.toLowerCase().split(' ')[0]
        if (firstWord === 'yes') {
          runtimeDatabase.updateUser(user.id, {
            acceptedDesc: true,
          });
          return askNextQuestion(parser, user);
        }
        runtimeDatabase.updateDesc(user.id, null);
        return askNextQuestion(parser, user);

      default:
        break;
    }
  }

  // Switching by the first word
  switch (text.toLowerCase().split(' ')[0]) {
    case 'hi':
    case 'hello':
      return parser.sendMessage(messageTypes.TEXT, WELCOME_MESSAGE);

    case 'forget':
      runtimeDatabase.state.users[parser.senderId] = null;
      return parser.sendMessage(messageTypes.TEXT, 'Forgot');

    case 'yes':
      switch (user.askedQuestion.type) {
        case questionTypes.DESC_QUESTION:
          runtimeDatabase.updateUser(parser.senderId, {
            acceptedDesc: true,
          });
          const question = nextQuestionToAsk(user);
          return askQuestion(question, parser);

        default:
          return parser.sendMessage(messageTypes.TEXT, 'Yes? OK...');

      }

    case 'no':
      switch (user.askedQuestion.type) {
        case questionTypes.DESC_QUESTION:
          runtimeDatabase.updateUser(parser.senderId, {
            description: null,
          });
          const question = nextQuestionToAsk(user);
          return askQuestion(question, parser);

        default:
          return parser.sendMessage(messageTypes.TEXT, 'No? OK...');
      }

    case 'welcome':
      return parser.sendMessage(messageTypes.TEXT, 'Are you saying welcome to me?');

    default:
      return parser.sendMessage(messageTypes.TEXT, DONT_UNDERSTAND_MESSAGE);
  }
}

module.exports = handleTextMessage;
