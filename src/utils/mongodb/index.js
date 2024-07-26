const { MongoClient } = require('mongodb')
const configs = require('../configs')

class Client {
  constructor(dbConfigs) {
    this.connectPromiseEntries = {}
    this.clients = {}
    this.configs = dbConfigs

    try {
      for (const [clusterAlias, clusterConfig] of Object.entries(dbConfigs)) {
        console.log(
          `Connecting to DB '${clusterAlias}' with uri: ${clusterConfig.uri}`,
        )

        const client = new MongoClient(clusterConfig.uri, {
          family: 4,
          ...clusterConfig.options,
        })

        this.clients[clusterAlias] = client

        this._register(client, clusterAlias, clusterConfig.required)
      }
    } catch (e) {
      console.error(e)
    }
  }

  _register(client, clusterAlias, required = true) {
    const p = client
      .connect()
      .then(() => {
        return clusterAlias
      })
      .catch((err) => {
        if (required) {
          console.error(
            `CRITICAL: Failed to connect to DB '${clusterAlias}' with error ${err}`,
          )
        } else {
          console.warn(
            `Failed to connect to DB '${clusterAlias}' with error ${err}`,
          )
        }

        setTimeout(() => {
          this._register(
            client,
            clusterAlias,
            this.configs[clusterAlias].required,
          )
        }, 5000)

        return null
      })

    this.connectPromiseEntries[clusterAlias] = { connectPromise: p, required }
  }

  reconnectDB() {
    for (const [clusterAlias, client] of Object.entries(this.clients)) {
      if (!client.topology) {
        console.log(`Reconnect ${clusterAlias} DB`)
        this._register(
          client,
          clusterAlias,
          this.configs[clusterAlias].required,
        )
      }
    }
  }

  checkRequiredDBConnected() {
    for (const [clusterAlias, client] of Object.entries(this.clients)) {
      if (
        this.configs[clusterAlias].required !== false &&
        client.topology === undefined
      ) {
        return false
      }
    }

    return true
  }

  runAfterAllConnected(cb, onlyRequired = true) {
    const promises = Object.values(this.connectPromiseEntries)
      .filter((entry) => !onlyRequired || entry.required)
      .map((entry) => entry.connectPromise)

    Promise.all(promises).then((names) => {
      cb(names)
    })
  }

  _getDb(clusterAlias) {
    const client = this.clients[clusterAlias]

    if (!client) {
      console.log(`DB '${clusterAlias}' is not connected.`)

      const err = new Error(`DB '${clusterAlias}' is not connected`)

      throw err
    }

    return client.db()
  }

  get mainDb() {
    return this._getDb('main')
  }
}

const dbConfigs = {
  main: {
    uri: encodeURI(configs.dbUri),
    options: {
      maxPoolSize: configs.dbConnectionPoolSize,
      maxIdleTimeMS: 30000,
    },
  },
}

const client = new Client(dbConfigs)

client.runAfterAllConnected((names) => {
  console.log(`Required DBs are connected: [${names}]`)
}, true)

module.exports = client
