const router = require("express").Router();
const User = require("../models/User")
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const { generateAccessToken, generateRefreshToken, readRefreshTokens, saveRefreshTokens, } = require("./helpers/tokens");


//REGISTER
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
      // create token /create refresh token
      const accessToken = generateAccessToken(user)
      const refreshToken = generateRefreshToken(user)
      // take tokens from db
      const tokens = await readRefreshTokens()
      tokens.push(refreshToken)
      // save tokens to db
      await saveRefreshTokens(tokens)
      res.status(200).json({ accessToken, refreshToken })
    } catch (err) {
      res.status(500).json(err.message)
    }
  }
  // delete token
  async delete(req, res, next) {
    if (req.user._id === req.params.userId || req.user.isAdmin) {
      res.status(200).json('user has been deleted')
    } else {
      res.status(403).json('You are not allowed to delete this user!')
    }

  }
  // refresh token
  async refresh(req, res) {
    console.log(req.body)
    const refreshToken = req.body.refreshToken
    try {
      if (!refreshToken) {
        return res.status(401).json('You are not authenticated.')
      }
      let tokens = await readRefreshTokens()
      if (!tokens.includes(refreshToken)) {
        return res.status(403).json('Refresh token is not valid!')
      }
      jwt.verify(refreshToken, 'mySecretKey', async (err, payload) => {
        err && console.log(err)
        tokens = tokens.filter(token => token !== refreshToken)
        const newAccessToken = generateAccessToken(payload.user)
        const newRefreshToken = generateRefreshToken(payload.user)
        tokens.push(newRefreshToken)
        const save = await saveRefreshTokens(tokens)
        res.status(200).json({
          accessToken: newAccessToken,
          refreshToken: newRefreshToken
        })
      })
    } catch (error) {
      res.status(500).json(error.message)
    }
  }
  // logout
  async logout(req, res) {
    const refreshToken = req.body.refreshToken
    try {
      let tokens = await readRefreshTokens()
      tokens = tokens.filter(token => token !== refreshToken)
      const save = await saveRefreshTokens(tokens)
      res.status(200).json({ message: 'You logged out seccessful.', logout: true })
    } catch (error) {
      res.status(500).json(error.message)

    }
  }
}


module.exports = new authController();

