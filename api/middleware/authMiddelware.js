const jwt = require('jsonwebtoken');
const User = require('../models/User')


module.exports = function (req, res, next) {
  const authHeader = req.headers.authorization
  if (authHeader) {
    const token = authHeader.split(' ')[1]
    jwt.verify(token, 'mySecretKey', async (err, payload) => {
      if (err) {
        return res.status(403).json('Token is not valid')
      } else {
        req.user = await User.findById(payload.user._id)
        next()
      }
    })
  } else {
    res.status(401).json('You are not authenticated!')
  }
}