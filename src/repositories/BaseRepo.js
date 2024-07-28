const { ObjectId } = require('mongodb')

class BaseRepo {
  constructor(collection) {
    this.collection = collection
  }

  async findOneAndUpdate({
    filter,
    update,
    option = { upsert: true, returnDocument: 'after' },
  }) {
    try {
      const result = await this.collection.findOneAndUpdate(
        filter,
        update,
        option,
      )

      return result?.value
    } catch (error) {
      console.error(error)
    }
  }

  async insert({ data }) {
    try {
      const result = await this.collection.insertOne({ ...data })
      return result?.insertedId
    } catch (error) {
      console.error(error)
    }
  }

  async insertMany({ data }) {
    try {
      const result = await this.collection.insertMany([...data])
      return result?.insertedId
    } catch (error) {
      console.error(error)
    }
  }

  async delete({ filter }) {
    try {
      const result = await this.collection.deleteMany(filter)
      return result?.deletedCount
    } catch (error) {
      console.error(error)
    }
  }

  async findOne({ filter, projection = null }) {
    const options = {}
    if (projection) {
      options.projection = projection
    }

    const result = await this.collection.findOne(filter, options)
    return result
  }

  async find({ filter = {}, projection = null, sort = null, limit = null }) {
    let result = await this.collection.find(filter, projection)
    if (sort) {
      result = result.sort(sort)
    }
    if (limit) {
      result = result.limit(limit)
    }
    result = await result.toArray()
    return result
  }

  async updateOne({ filter, update, option }) {
    try {
      const result = await this.collection.updateOne(filter, update, option)
      return result
    } catch (error) {
      console.error(error)
    }
  }

  async updateMany({ filter, update, option }) {
    try {
      const result = await this.collection.updateMany(filter, update, option)
      return result
    } catch (error) {
      console.error(error)
    }
  }

  async push({ userId, push }) {
    const result = await this.collection.updateOne(
      { userId: new ObjectId(userId) },
      { $push: push },
    )

    return result
  }

  async aggregate({ pipeline }) {
    const result = await this.collection.aggregate(pipeline).toArray()
    return result
  }

  async bulkWrite({ operations }) {
    try {
      const result = await this.collection.bulkWrite(operations)
      return result
    } catch (error) {
      console.error(error)
    }
  }
}

module.exports = BaseRepo
