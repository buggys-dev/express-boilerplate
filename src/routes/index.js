const express = require('express')
const auth = require('../middleware/auth')
const sendRes = require('../utils/responseFormatter')

const router = express.Router()

router.get(
  '/',
  auth,
  wrapAsync(async (req, res) => {
    console.log('is in')
    return null
  }),
)

function wrapAsync(fn) {
  return (req, res, next) => {
    fn(req, res, next).catch(next)
  }
}

module.exports = router
