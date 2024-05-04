const crypto = require("crypto");

// 랜덤한 바이트로 구성된 비밀 문자열 생성
const accessTokenSecret = crypto.randomBytes(64).toString("hex");

console.log("ACCESS_TOKEN_SECRET:", accessTokenSecret);
