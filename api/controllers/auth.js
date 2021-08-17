const User = require("../models/User")
const Tokens = require('../models/Tokens')
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const { generateNewTokens } = require("./helpers/tokens");


class authController {
  async register(req, res) {

    try {
      //generate new password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);

      //create new user
      const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword,
      });

      //save user and respond
      const user = await newUser.save();
      res.status(200).json(user);
    } catch (err) {
      res.status(500).json(err)
    }
  }
  //LOGIN
  async login(req, res) {
    try {
      const user = await User.findOne({ email: req.body.email });
      !user && res.status(404).json("user not found");

      const validPassword = await bcrypt.compare(req.body.password, user.password)
      !validPassword && res.status(400).json("wrong password")
      // change password
      user.password = 'This data is not for you.'
      const { accessToken, refreshToken } = await generateNewTokens({ loginUser: user })
      const newRefreshToken = new Tokens({ refreshToken: refreshToken })
      const { _id } = await newRefreshToken.save()
      res.status(200).json({ accessToken, refreshToken, id: _id })
    } catch (err) {
      res.status(500).json(err.message)
    }
  }

  // refresh token
  async refresh(req, res) {
    const refreshToken = req.body.refreshToken
    try {
      if (!refreshToken || !req.body.id || refreshToken === null) {
        return res.status(401).json('You are not authenticated.')
      }
      let token = await Tokens.findById(req.body.id) 
      if (token.refreshToken !== refreshToken || token === null) {
        return res.status(403).json('Refresh token is not valid!')
      }
      jwt.verify(refreshToken, 'mySecretKey', async (err, decoded) => {
        if (err) {
          return res.status(404).json(err.message)
        } else {
          const deleteToken = await Tokens.findByIdAndDelete(token._id)
          const { newAccessToken, newRefreshToken } = await generateNewTokens({ userId: decoded.user._id })
          const newRefreshToken_DB = new Tokens({
            refreshToken: newRefreshToken
          })
          const { _id } = await newRefreshToken_DB.save()
          res.status(200).json({
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
            id: _id
          })
        }
      })
    } catch (error) {
      res.status(500).json(error.message)
    }
  }
  // logout
  async logout(req, res) {
    try {
      let token = await Tokens.findByIdAndDelete(req.body.id)
      res.status(200).json({ message: 'You logged out seccessful.', logout: true })
    } catch (error) {
      res.status(500).json(error.message)

    }
  }
}


module.exports = new authController();

