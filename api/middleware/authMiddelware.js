const jwt = require('jsonwebtoken');


module.exports = function (req, res, next) {

  const authHeader = req.headers.authorization
  if (authHeader) {
    const token = authHeader.split(' ')[1]
    jwt.verify(token, 'secretKey', (err, payload) => {
      if (err) {
        return res.status(403).json('Token is not valid')
      } else {
        console.log(payload)
        req.user = payload
        next()
      }
    })
  } else {
    res.status(401).json('You are not authenticated!')
  }
}