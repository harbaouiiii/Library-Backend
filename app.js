const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
var cors = require('cors');
const app = express();
require('dotenv/config');

//Import routes
const booksRoute = require('./routes/books');
const authRoute = require('./routes/auth');

app.use(bodyParser.json());
app.use(cors());
app.use('/auth',authRoute);
app.use('/books',booksRoute);

//Connect to DB
mongoose.connect(
    process.env.DB_CONNECT, 
    { useNewUrlParser: true },
    () => console.log('Connected to DB succefully!')
);

//Port listening
app.listen(8080);