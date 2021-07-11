const express = require('express')
const app = express()
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const helmet = require('helmet')
const morgan = require('morgan')
const multer = require('multer')
const path = require('path')

// routes
const userRoute = require('./api/routes/users')
const authRoute = require('./api/routes/auth')
const postRoute = require('./api/routes/post')


dotenv.config()


mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true },
  () => { console.log('mongoDB connect') });

app.use('/images', express.static(path.join(__dirname, 'public/images')))
// midleware
app.use(express.json())
app.use(helmet())
app.use(morgan('common'))

// upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "public/images/post"))
  },

  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

app.post("/api/upload", upload.array('file', 1), (req, res) => {
  // const { name, age } = req.body
  console.log('fields', req.body)
  try {
    return res.status(200).json("File uploded successfully");
  } catch (error) {
    console.error(error);
    res.json(error.message)
  }
});
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