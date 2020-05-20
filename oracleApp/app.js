var createError = require('http-errors');
var express = require('express');
var dbHandler = require('./db/databaseHandler');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var scedule = require('./scheduler/scheduleHandler');
var oracleContractHandler = require('./contractHandler/oracleContractHandler');

var indexRouter = require('./routes/index');

dbHandler.initDb().then(async () => {
  // await dbHandler.saveErrorResponse("asd", "asdsa");
});
var app = express();

app.set('views', path.join(__dirname, 'views'));
app.engine('.html', require('ejs').renderFile);


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

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
  //res.render('error');
  res.write(err.toString());
  res.end();
});
var oracleContract = new oracleContractHandler();
scedule(oracleContract);
module.exports = app;
