const _ = require('lodash');
const messageTypes = require('./factories/message-types');
const runtimeDatabase = require('./runtime-database');
const axios = require('axios');
const { SCRAPPER_ENDPOINT } = require('../config');

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
  // return runtimeDatabase.getInvestors().then(() => {
  //
  // });
  return axios.get(`${SCRAPPER_ENDPOINT}?url=${user.url}`).then((response) => {
     console.log(`RESPONSSEESSESE: ${response.data['sectors']}`)
     const sectors = response.data.sectors;
     return runtimeDatabase.getInvestorsBySectors(sectors);
   }).catch((error) => {
     console.log(`ERROR in scrapper: ${error.message}`);
   });
}

function askNextQuestion(parser, user) {
  const question = nextQuestionToAsk(user);
  if (question) {
    return askQuestion(question, parser);
  }
  generateListOfInvestors(user).then((response) => {
    let investors = runtimeDatabase.state.investors;
    console.log(`There are ${investors.length} investors`);
    investors = _.map(investors, (investor) => {
      const company = investor.company;
      const fullName = investor.full_name;
      const url = investor.crunchbase;
      const image = investor.image_url;

      const element = {
        title: company,
        image_url: image,
        subtitle: fullName,
        default_action: {
          type: "web_url",
          url,
          messenger_extensions: false,
          webview_height_ratio: "tall",
        },
      buttons: [
        {
          type:"web_url",
          url,
          title:"View Website"
        }
      ]
    };
      return element;
    }
    );

    const attachment = {
      type:"template",
      payload: {
        template_type: "generic",
        elements: investors,
    }
  }
    parser.sendMessage(messageTypes.TEXT, 'Here are your investors').then(() => {
      parser.sendMessage(messageTypes.ATTACHMENTS, attachment);
    });

    console.log(investors);

  });
  return parser.sendMessage(messageTypes.TEXT, '.');
}

module.exports = {
  nextQuestionToAsk,
  questionTypes,
  questions,
  askQuestion,
  askNextQuestion,
};
