require('dotenv').config()

const configs = {
  port: null,
  dbUserName: null,
  dbPassword: null,
  dbName: null,
  dbConnectionPoolSize: 10,
  blogAccountPassword: null,
  gptOrganization: null,
  gptProject: null,
  gptApiKey: null,
}

configs.dbName = process.env.DB_NAME
configs.dbUserName = process.env.DB_USER_NAME
configs.dbPassword = process.env.DB_PASSWORD
configs.dbConnectionPoolSize = process.env.DB_CONNECTION_POOL_SIZE
configs.port = process.env.PORT_PRODUCTION
configs.cluster0Uri = `mongodb+srv://${configs.dbUserName}:${configs.dbPassword}@cluster0.5ykvdev.mongodb.net/${configs.dbName}?retryWrites=true`
configs.blogAccountPassword = process.env.BLOG_ACCOUNT_PASSWORD

module.exports = configs
