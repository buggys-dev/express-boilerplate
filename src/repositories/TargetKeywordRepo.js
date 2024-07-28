const client = require('../utils/mongodb')
const BaseRepo = require('./BaseRepo')

class TargetKeywordRepo extends BaseRepo {
  constructor() {
    super(client.cluster0.collection('target_keyword'))
  }
}

module.exports = new TargetKeywordRepo()
