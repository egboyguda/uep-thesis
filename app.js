const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const PORT = process.env.PORT || 3000;
require('dotenv').config();
const ejsMate = require('ejs-mate');
const passport = require('passport');
const localStrategy = require('passport-local');
const session = require('express-session');
const User = require('./models/user');
const partials = require('express-partials');
//pag open sa databese
//'mongodb://localhost/web-based-relief-tracking' |
mongoose.connect(process.env.DB_URL, {
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

const sessionConfig = {
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};

//dd pag use sa session
app.use(session(sessionConfig));

//dd pag gamit na sa passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

//dd para n sa session log in log out
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//dd an mga route

//template na gamit para sa frontend
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.engine('ejs', ejsMate);

// para ma access sa ejs n na varible miskn
//wara ig pass sa route

//static file
//mga js an css
app.use(express.static(path.join(__dirname, 'public')));

//dd pag handle sa form tkang sa request
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  //res.locals.isStaff = req.user.isStaff;
  next();
});

const adminRoutes = require('./routes/admin');
const staffRoutes = require('./routes/staff');
app.use('/', adminRoutes);
app.use('/staff', staffRoutes);

app.listen(PORT, () => {
  console.log('app is running');
});
