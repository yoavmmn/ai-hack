const messageTypes = require('../factories/message-types');
const handleLinkMessage = require('./link-handler');
const { nextQuestionToAsk, questionTypes, askQuestion } = require('../questions-manager');
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

  if (user.description) {
    // User has already set the description
    if (user.acceptedDesc) {
      // User has already accepted the description

    } else {
      const quickReplyProp = {
        text: `Are you sure about your description?\n
          Description: ${user.description}`,
        quickReplies: [
          {
            content_type: 'text',
            title: 'Yes',
          },
          {
            content_type: 'text',
            title: 'No',
          }
        ],
      };
      return parser.sendMessage(messageTypes.QUICK_REPLY, quickReplyProp);
    }
  }

  // Switching by the first word
  switch (text.toLowerCase().split(' ')[0]) {
    case 'hi':
    case 'hello':
      return parser.sendMessage(messageTypes.TEXT, WELCOME_MESSAGE);

    case 'yes':
      switch (user.askedQuestion.type) {
        case questionTypes.DESC_QUESTION:
          runtimeDatabase.updateUser(parser.senderId, {
            acceptedDesc: true,
          });
          const question = nextQuestionToAsk(user);
          return askQuestion(question, parser);
          break;

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
