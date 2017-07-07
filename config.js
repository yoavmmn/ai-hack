const PAGE_ACCESS_TOKEN = process.env.FACEBOOK_TOKEN;

const WELCOME_MESSAGE = 'Welcome, please enter a link.';

const DONT_UNDERSTAND_MESSAGE = 'I\'m so sorry... But I cannot understand you. Please try something else :)';

const DB_CONNECTION = 'mongodb://login_user:100200300@ds151452.mlab.com:51452/investores';

const SCRAPPER_ENDPOINT = 'https://ai-hack-scraper.herokuapp.com/scrape';

module.exports = {
  PAGE_ACCESS_TOKEN,
  WELCOME_MESSAGE,
  DONT_UNDERSTAND_MESSAGE,
  DB_CONNECTION,
  SCRAPPER_ENDPOINT,
};
