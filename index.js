const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');

const app = express();

app.use(methodOverride());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const router = require('./routes/router');

app.use('/', router);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Running on http://127.0.0.1:${PORT}/`);
});
