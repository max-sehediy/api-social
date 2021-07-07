const express = require('express')
const app = express()
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const helmet = require('helmet')
const morgan = require('morgan')

// routes
const userRoute = require('./api/routes/users')
const authRoute = require('./api/routes/auth')
const postRoute = require('./api/routes/post')


dotenv.config()


mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true },
  () => { console.log('mongoDB connect') });

// midleware
app.use(express.json())
app.use(helmet())
app.use(morgan('common'))

// routes
app.get('/', (req, res) => {
  res.send('it is work')
})
app.use('/api/users', userRoute)
app.use('/api/auth', authRoute)
app.use('/api/post', postRoute)





app.listen(8800, () => {
  console.log('server start')
})