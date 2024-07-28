const { MongoClient } = require('mongodb')
const configs = require('./configs')

class Client {
  constructor(dbConfigs) {
    this.connectPromiseEntries = {}
    this.clients = {}
    this.configs = dbConfigs

    try {
      for (const [clusterAlias, clusterConfig] of Object.entries(dbConfigs)) {
        console.debug(
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
        console.debug(`Reconnect ${clusterAlias} DB`)
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

  _getDb(clusterAlias) {
    const client = this.clients[clusterAlias]

    if (!client) {
      const err = new Error(`DB '${clusterAlias}' is not connected`)

      throw err
    }

    return client.db()
  }

  runAfterAllConnected(cb, onlyRequired = true) {
    const promises = Object.values(this.connectPromiseEntries)
      .filter((entry) => !onlyRequired || entry.required)
      .map((entry) => entry.connectPromise)

    Promise.all(promises).then((names) => {
      cb(names)
    })
  }

  get cluster0() {
    return this._getDb('cluster0')
  }
}

const dbConfigs = {
  cluster0: {
    uri: encodeURI(configs.cluster0Uri),
    options: {
      maxPoolSize: configs.dbConnectionPoolSize,
    },
  },
}

const client = new Client(dbConfigs)

client.runAfterAllConnected((names) => {
  console.debug(`Required DBs are connected: [${names}]`)
}, true)

module.exports = client
