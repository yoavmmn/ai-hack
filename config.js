const PAGE_ACCESS_TOKEN = process.env.FACEBOOK_TOKEN;

const WELCOME_MESSAGE = 'Welcome, please enter a link.';

const DONT_UNDERSTAND_MESSAGE = 'I\'m so sorry... But I cannot understand you. Please try something else :)';

const DB_CONNECTION = process.env.DB_URL;

const SCRAPPER_ENDPOINT = process.env.SCRAPPER_ENDPOINT;

module.exports = {
  PAGE_ACCESS_TOKEN,
  WELCOME_MESSAGE,
  DONT_UNDERSTAND_MESSAGE,
  DB_CONNECTION,
  SCRAPPER_ENDPOINT,
};
