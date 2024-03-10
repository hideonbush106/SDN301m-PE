var createError = require('http-errors')
var express = require('express')
var path = require('path')
var cookieParser = require('cookie-parser')
var logger = require('morgan')
var dbConnect = require('./utils/db.connect')
var passport = require('passport')
var session = require('express-session')

var indexRouter = require('./routes/index.routes')
var authRouter = require('./routes/auth.routes')
var viewRouter = require('./routes/view.routes')
var coursesRouter = require('./routes/courses.routes')
var sectionRouter = require('./routes/sections.routes')
require('./middleware/auth.middleware')
// use the strategy

var app = express()
app.set('trust proxy', 1) // trust first proxy
app.use(
  session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
)
dbConnect('mongodb://127.0.0.1:27017/PE_SDN301m_TrialTest_SE171647')

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'hbs')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', indexRouter)
app.use('/', viewRouter)
app.use(
  '/courses',
  passport.authenticate('jwt', { session: false }),
  coursesRouter
)
app.use('/auth', authRouter)
app.use('/sections/', sectionRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
