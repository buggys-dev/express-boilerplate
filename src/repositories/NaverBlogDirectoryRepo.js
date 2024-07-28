const client = require('../utils/mongodb')
const BaseRepo = require('./BaseRepo')

class NaverBlogDirectoryRepo extends BaseRepo {
  constructor() {
    super(client.cluster0.collection('naver_blog_directory'))
  }
}

module.exports = new NaverBlogDirectoryRepo()
