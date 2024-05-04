require('dotenv').config()

const configs = {
  environment: 'dev',
  accessTokenSecret: null,
  dbPassword: null,
  dbName: null,
  port: null,
}

if (process.env.NODE_ENV === 'production') {
  configs.port = process.env.PORT_PRODUCTION
  configs.environment = 'production'
}
if (process.env.NODE_ENV === 'development') {
  configs.port = process.env.PORT_DEVELOPMENT
  configs.environment = 'development'
}

configs.accessTokenSecret = process.env.ACCESS_TOKEN_SECRET

module.exports = configs
