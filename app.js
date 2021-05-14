const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const PORT = 3000 || process.env.PORT;
require('dotenv').config();
const ejsMate = require('ejs-mate');

//pag open sa databese
//'mongodb://localhost/web-based-relief-tracking' |
mongoose.connect('mongodb://localhost/web-based-relief-tracking', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log('DATABASE IS CONNECTED');
});
//dd an mga route

//template na gamit para sa frontend
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.engine('ejs', ejsMate);

//static file
//mga js an css
app.use(express.static(path.join(__dirname, 'public')));

//dd pag handle sa form tkang sa request
app.use(express.urlencoded({ extended: true }));

const adminRoutes = require('./routes/admin');
app.use('/', adminRoutes);

app.listen(PORT, () => {
  console.log('app is running');
});
