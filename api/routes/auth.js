const router = require('express').Router()
const User = require('../models/User')
const bcrypt = require('bcrypt')

router.get('/', (req, res) => {
  res.send('wow')
})

router.post('/register', async (req, res, next) => {
  const { userName, email, password } = req.body

  try {
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(req.body.password, salt)
    const newUser = new User({
      userName, email, password: hashedPassword
    })
    const user = await newUser.save()
    res.status(200).json(user)
  } catch (error) {
    res.status(500).json(error.message)
  }
})

router.post('/login', async (req, res, next) => {
  const { userName, email, password } = req.body
  try {
    const user = await User.findOne({ email })
    !user && res.status(404).send('user not found')

    const validPassword = await bcrypt.compare(password, user.password)
    !validPassword && res.status(400).json('wrong password')

    res.status(200).json(user)
  } catch (error) {
    res.status(500).json(error.message)
  }


})


module.exports = router