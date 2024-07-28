const express = require('express')
const auth = require('../middleware/auth')
const sendRes = require('../utils/responseFormatter')
const BlogService = require('../services/BlogService')

const router = express.Router()

router.get(
  '/naver-directory',
  // auth,
  wrapAsync(async (req, res) => {
    const result = await BlogService.getNaverDirectoryInfo()
    return sendRes(req, res, 200, {
      status: 200,
      data: result,
    })
  }),
)

router.post(
  '/blog/keyword',
  // auth,
  wrapAsync(async (req, res) => {
    const { date, keywords, seq } = req.body
    const result = await BlogService.postNaverBlogKeyword(date, keywords, seq)
    return sendRes(req, res, 200, {
      status: 200,
      data: result,
    })
  }),
)

router.get(
  '/blog/keyword',
  // auth,
  wrapAsync(async (req, res) => {
    const { date } = req.query
    const result = await BlogService.getNaverBlogKeyword(date)
    return sendRes(req, res, 200, {
      status: 200,
      data: result,
    })
  }),
)

function wrapAsync(fn) {
  return (req, res, next) => {
    fn(req, res, next).catch(next)
  }
}

module.exports = router
