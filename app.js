const express = require("express");

const app = express();
const port = 3000;

// 여기에 미들웨어 및 라우트 설정을 추가

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
