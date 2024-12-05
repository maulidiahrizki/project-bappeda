const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const flash = require('connect-flash');

// Routes
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const superadminRouter = require('./routes/superRoutes');
const bidangRouter = require('./routes/bidangRoutes');
const adminRoutes = require('./routes/adminRoutes');
const sasaranRoutes = require('./routes/sasaranRoutes');
const programRoutes = require('./routes/programRoutes');
const kegiatanRoutes = require('./routes/kegiatanRoutes');
const subkegiatanRoutes = require('./routes/subkegiatanRoutes');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Session and flash configuration
app.use(
  session({
    secret: 'secretKey', // replace 'secretKey' with a secure secret key
    resave: false,
    saveUninitialized: true,
  })
);
app.use(flash());

// Routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/superadmin', superadminRouter);
app.use('/bidang', bidangRouter);
app.use('/adminkabid', adminRoutes);
app.use('/sasaran', sasaranRoutes);
app.use('/program', programRoutes);
app.use('/kegiatan', kegiatanRoutes);
app.use('/sub_kegiatan', subkegiatanRoutes);

// Middleware to make flash messages accessible in views
app.use((req, res, next) => {
  res.locals.successMessage = req.flash('success');
  res.locals.errorMessage = req.flash('error');
  next();
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
