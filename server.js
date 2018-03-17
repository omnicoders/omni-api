const express = require('express');
const bodyParser = require('body-parser');

// set port to the environment variable settings or 3000 if none exist
const port = process.env.PORT || 3000; 

// instantiate express app
const app = express();

// middleware that accepts urlencoded form data
// https://github.com/expressjs/body-parser#bodyparserurlencodedoptions
app.use(bodyParser.urlencoded({ extended: true }));

// middleware that accepts json 
// https://github.com/expressjs/body-parser#bodyparserjsonoptions
app.use(bodyParser.json());

// static info routes
require('./routes/static.js')(app);

// launch server
app.listen(port, () => {
	console.log(`API running on port ${port}`);
});