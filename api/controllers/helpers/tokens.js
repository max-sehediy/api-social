const jwt = require('jsonwebtoken');
const User = require('../../models/User')

const generateNewTokens = async (data) => {
  const { userId, loginUser } = data
  if (userId) {
    let user = await User.findById(userId)
    user.password = 'Yes of course, it was a password some time ago.'
    const newAccessToken = jwt.sign({ user }, 'mySecretKey', { expiresIn: '5m' })
    const newRefreshToken = jwt.sign({ user }, 'mySecretKey')
    return { newAccessToken, newRefreshToken }
  } else {
    const accessToken = jwt.sign({ user: loginUser }, 'mySecretKey', { expiresIn: '5m' })
    const refreshToken = jwt.sign({ user: loginUser }, 'mySecretKey')
    return { accessToken, refreshToken }
  }
}
module.exports = { generateNewTokens }