const router = require('express').Router()
const User = require('../models/User')
const bcrypt = require('bcrypt')


//update user
router.put('/:id', async (req, res, next) => {
  // const _id = req.params
  // let { userId, password, isAdmin } = req.body
  console.log(`object======>`, req.body.userId === req.params.id || req.body.isAdmin)
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    if (req.body.password) {
      try {
        const salt = await bcrypt.genSalt(10)
        req.body.password = await bcrypt.hash(req.body.password, salt)
      } catch (error) {
        res.status(500).json(error.message)
      }
      try {
        const user = await User.findByIdAndUpdate(req.params.id, {
          $set: req.body
        })
        res.status(200).json('Account has been updated')
      } catch (error) {
        res.status(500).json(error.message)
      }
    }
  } else {
    return res.status(403).json('You can update only your account!')
  }
  // res.json({ bodyId: req.body.userId, paramsId: req.params.id, boolean: req.body.userId === req.params.id, body: req.body })
})

//delete user
router.delete('/:id', async (req, res, next) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    try {
      const user = await User.findByIdAndDelete(req.params.id)
      res.status(200).json('Account has been deleted')
    } catch (error) {
      res.status(500).json(error.message)
    }
  } else {
    return res.status(403).json('You can delete only your account!')
  }
})

//get a user
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    const { password, updatedAt, ...other } = user._doc
    res.status(200).json(other)
  } catch (error) {
    res.status(500).json(error.message)
  }
})

//follow user
router.put('/:id/follow', async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id)
      const currentUser = await User.findById(req.body.userId)
      if (!user.followers.includes(req.body.userId)) {
        await user.updateOne({ $push: { followers: req.body.userId } })
        await currentUser.updateOne({ $push: { followings: req.params.id } })
        res.status(200).json('user has been followed')
      } else {
        res.status(403).json('you allready follow this user')
      }
    } catch (error) {
      res.status(500).json(console.error.message)
    }
  } else {
    res.status(403).json('you can\'t follow yourself')
  }
})

//unfollow user
router.put('/:id/unfollow', async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id)
      const currentUser = await User.findById(req.body.userId)
      if (user.followers.includes(req.body.userId)) {
        await user.updateOne({ $pull: { followers: req.body.userId } })
        await currentUser.updateOne({ $pull: { followings: req.params.id } })
        res.status(200).json('user has been unfollowed')
      } else {
        res.status(403).json('you don\'t follow this user')
      }
    } catch (error) {
      res.status(500).json(console.error.message)
    }
  } else {
    res.status(403).json('you can\'t unfollow yourself')
  }
})

module.exports = router