const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');
const usersRouter = require('./routes/users');
const leadsRouter = require('./routes/leads');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const crypto = require('crypto');
const User = require('./models/User');

dotenv.config();

app.use(cors(
  {
    origin: ["https://lead-app-ru5j.vercel.app/"],
    methods: ["POST", "GET"],
    credentials: true
  }
));

const app = express();
const PORT = process.env.PORT || 5001;
app.set('port', PORT);

// Middleware to parse JSON bodies
app.use(express.json());
app.use(bodyParser.json());

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// 'mongodb://localhost:27017/mern-lead-app'
// process.env.MONGO_URL
mongoose.connect('mongodb+srv://tiwariabhi0501:tiwariabhi.0501@lead-app.4zjzc.mongodb.net/lead-app?retryWrites=true&w=majority&appName=lead-app')
        .then((e) => console.log("MongoDB Connected"));

app.use('/users', usersRouter);
app.use('/leads', leadsRouter);

app.use((req, res, next) => {
  next(createError(404));
});

app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.json({ error: err.message });
});

app.get("/", (req, res) => {
  res.json("Hello");
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = app;
