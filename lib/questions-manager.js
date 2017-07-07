const messageTypes = require('./factories/message-types');
const runtimeDatabase = require('./runtime-database');

const questionTypes = {
  URL_QUESTION: 'URL_QUESTION',
  DESC_QUESTION: 'DESC_QUESTION',
  SURE_ABOUT_DESC_QUESTION: 'SURE_ABOUT_DESC_QUESTION',
};

const questions = {
  URL_QUESTION: {
    type: questionTypes.URL_QUESTION,
    text: 'Please enter a URL of your website',
    messageType: messageTypes.TEXT,
  },
  DESC_QUESTION: {
    type: questionTypes.DESC_QUESTION,
    text: 'Please enter a description about your Startup.',
    messageType: messageTypes.TEXT
  },
  SURE_ABOUT_DESC_QUESTION: {
    type: questionTypes.SURE_ABOUT_DESC_QUESTION,
    text: 'Are you sure about the description?',
    messageType: messageTypes.QUICK_REPLY,
    quickReplies: [
      {
        type: 'text',
        title: 'Yes',
      },
      {
        type: 'text',
        title: 'No',
      }
    ]
  }
};

function nextQuestionToAsk(user) {
  let question = null;
  if (!user.url) {
    question = questions.URL_QUESTION;
  } else if (!user.description) {
    question = questions.DESC_QUESTION;
  } else if (!user.acceptedDesc) {
    question = questions.SURE_ABOUT_DESC_QUESTION;
  }

  return question;
}

function askQuestion(question, parser) {
  runtimeDatabase.updateUser(parser.senderId, {
    askedQuestion: question,
  });

  if (question.messageType === messageTypes.TEXT) {
    return parser.sendMessage(messageTypes.TEXT, question.text);
  } else if (question.messageType === messageTypes.QUICK_REPLY) {
    return parser.sendMessage(messageTypes.QUICK_REPLY, {
      text: question.text,
      quickReplies: question.quickReplies,
    });
  }
  return parser.sendMessage(messageTypes.TEXT, question.text);
}

function generateListOfInvestors(user) {
  // Generate the list by the user.description, url, etc.
  return runtimeDatabase.getInvestors();
}

function askNextQuestion(parser, user) {
  const question = nextQuestionToAsk(user);
  if (question) {
    return askQuestion(question, parser);
  }
  generateListOfInvestors(user).then((docs) => {
    const investors = runtimeDatabase.state.investors;
    console.log(`There are ${investors.length} investors`);
    parser.sendMessage(messageTypes.TEXT, 'Here are your investors');
    parser.sendMessage(messageTypes.TEXT, investors.join('\n'));
  });
  return parser.sendMessage(messageTypes.TEXT, '');
}

module.exports = {
  nextQuestionToAsk,
  questionTypes,
  questions,
  askQuestion,
  askNextQuestion,
};
