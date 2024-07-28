const configs = require('./src/utils/configs')
const express = require('express')
const cors = require('cors')
const compression = require('compression')
const logger = require('morgan')
const path = require('path')
const moment = require('moment')
require('moment-timezone')

moment.tz.setDefault('Asia/Seoul')
const nunjucks = require('nunjucks')

const app = express()

// express 기본 설정들
app.use(cors())
app.set('view engine', 'ejs')
app.engine('html', require('ejs').renderFile)

nunjucks.configure('./src/views', {
  express: app,
  watch: true,
})

const logFormat =
  ':remote-addr [:date[clf]] ":method :url" :status :res[content-length] - :response-time ms ":user-agent"'

app.use(logger(logFormat))
app.use(compression())
app.use(express.json({ limit: '200mb' }))
app.use(
  express.urlencoded({
    limit: '200mb',
    extended: false,
    parameterLimit: 50000,
  }),
)
app.use(express.static(path.join(__dirname, 'public')))

const environment = configs.environment
console.log('SERVER ENV:', environment)

const sellerRouter = require('./src/routes/sellers')
const indexRouter = require('./src/routes/index')
const adminRouter = require('./src/routes/admin')
const client = require('./src/utils/mongodb')

// router 설정
app.use('/', indexRouter)
app.use('/sellers', sellerRouter)
app.use('/admin', adminRouter)

// Fallthrough error handler
app.use((err, req, res, next) => {
  console.error(
    `Catching error : ${err}, ${res.sentry} Request Url: ${
      req.url
    }, Request Body: ${JSON.stringify(req.body)}, Requst Method: ${
      req.method
    }, Request Headers: ${req.rawHeaders}, Aborted: ${req.aborted}`,
  )

  res.status(500).send(`Uncatched error: Check Sentry ${res.sentry}\n`)
})

client.runAfterAllConnected(() => {
  console.log(`Listening on port ${configs.port}!`)
  app.listen(configs.port)
})
