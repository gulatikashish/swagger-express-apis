const express = require('express')
const path = require('path')
const favicon = require('serve-favicon')
const logger = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const config = require('./config/config')
const users = require('./routes/users')
const swaggerTools = require('swagger-tools')
const app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')
const port = process.env.PORT || 3030 // used to create, sign, and verify tokens

// mongoose.connect(config.database) // connect to database

mongoURI = 'mongodb://swagger:swagger@ds059365.mlab.com:59365/swagger'
mongoose.connect(mongoURI, { useMongoClient: true })

app.set('superSecret', config.secret)
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

const options = {
  controllers: './controller',
  useStubs: process.env.NODE_ENV === 'development' ? true : false // Conditionally turn on stubs (mock mode)
}
// The Swagger document (require it, build it programmatically, fetch it from a URL, ...)
const swaggerDoc = require('./apiDocs/swagger.json')

// Initialize the Swagger middleware
swaggerTools.initializeMiddleware(swaggerDoc, function(middleware) {
  // Interpret Swagger resources and attach metadata to request - must be first in swagger-tools middleware chain
  app.use(middleware.swaggerMetadata())

  // Validate Swagger requests
  app.use(middleware.swaggerValidator())

  // Route validated requests to appropriate controller
  app.use(middleware.swaggerRouter(options))

  // Serve the Swagger documents and Swagger UI
  app.use(middleware.swaggerUi())

  // Start the server
})
app.use('/users', users)

// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   let err = new Error('Not Found')
//   err.status = 404
//   next(err)
// })

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

app.listen(port, (err, rest) => {
  if (err) {
    console.log('ERROR', err)
    return
  } else {
    console.log('SERVER STARTED AT', port)
  }
})
module.exports = app
