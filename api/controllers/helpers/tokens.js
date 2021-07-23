const { readFile, writeFile } = require('fs/promises')
const jwt = require('jsonwebtoken');
const path = require("path");


let obj = {}
const generateAccessToken = (user) => {
  return jwt.sign({ user }, 'mySecretKey', { expiresIn: '5m' })
}
const generateRefreshToken = (user) => {
  return jwt.sign({ user }, 'mySecretKey')
}
let readRefreshTokens = async () => {
  let verify = await readFile(path.resolve(__dirname, 'refreshTokens.json'), 'utf8')
  let { tokens } = JSON.parse(verify)
  return tokens
}
let saveRefreshTokens = async (array) => {
  obj.tokens = array
  await writeFile(path.resolve(__dirname, 'refreshTokens.json'), JSON.stringify(obj))
  return obj
}
module.exports = { generateAccessToken, generateRefreshToken, saveRefreshTokens, readRefreshTokens }