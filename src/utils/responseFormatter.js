const sendRes = async (req, res, statusCode, resData = null) => {
  let resDataModified = resData
  if (statusCode === 200) {
    if (resData === null) {
      await res.status(200).json({ status: statusCode, msg: '성공.' })
    } else {
      await res.status(200).json(resData)
    }
    return
  }

  if (statusCode === 500 && resData === null) {
    resDataModified = { status: 500, msg: '서버 에러.' }
  } else if (statusCode >= 200 && statusCode < 300 && resData === null) {
    resDataModified = { status: statusCode, msg: '성공.' }
  }
  await res.status(statusCode).json(resDataModified)
}

module.exports = sendRes
