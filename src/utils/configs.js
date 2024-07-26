require('dotenv').config()

const configs = {
  environment: 'dev',
  accessTokenSecret: null,
  dbPassword: null,
  dbUserName: null,
  dbUri: null,
  port: null,
  dbConnectionPoolSize: 1000,
}

if (process.env.NODE_ENV === 'production') {
  configs.port = process.env.PORT_PRODUCTION
  configs.environment = 'production'
  configs.dbPassword = process.env.DB_PASSWORD
  configs.dbUserName = process.env.DB_USER_NAME
  configs.dbUri = `mongodb+srv://${configs.dbUserName}:${configs.dbPassword}@cluster0.5ykvdev.mongodb.net?retryWrites=true`
}
if (process.env.NODE_ENV === 'development') {
  configs.port = process.env.PORT_DEVELOPMENT
  configs.environment = 'development'
}

configs.accessTokenSecret = process.env.ACCESS_TOKEN_SECRET

module.exports = configs
