require('dotenv').load();
const express = require('express');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const config = require('./config/database');
const mongoose = require('mongoose');
const port = process.env.PORT || 8550;

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

mongoose.connect(config.database);
let db = mongoose.connection;

// Check connection
db.once('open', () => {
  console.log('Connected to MongoDB!');
});

// Check for DB errors
db.on('error', (err) => {
  console.log(err);
});

app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

// Route Files
const posts = require('./routes/posts');
app.use('/posts', posts);

app.listen(port, function(){
  console.log('Server started!');
});