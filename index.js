const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const multer = require("multer");
const userRoute = require("./api/routes/users");
const authRoute = require("./api/routes/auth");
const postRoute = require("./api/routes/posts");
const conversationRoute = require("./api/routes/conversations");
const messageRoute = require("./api/routes/messages");
const path = require("path");
import cors from 'cors';

dotenv.config();

mongoose.connect(
  'mongodb+srv://' + process.env.MONGO_KEYS + '@cluster0.k971a.mongodb.net/social?retryWrites=true&w=majority',

  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log("Connected to MongoDB");
  }
);


app.use(cors())
// app.use(function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", '*');
//   res.header("Access-Control-Allow-Credentials", true);
//   res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
//   res.header("Access-Control-Allow-Headers", 'Authorization, Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
//   next();
// });

app.use("/images", express.static(path.join(__dirname, "public/images")));

//middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });
app.post("/api/upload", upload.single("file"), (req, res) => {
  try {
    return res.status(200).json("File uploded successfully");
  } catch (error) {
    console.log(error);
  }
});

app.get("/", (req, res) => {
  res.send(`<h1>Backend server is running!</h1>`)
});
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);
app.use("/api/conversations", conversationRoute);
app.use("/api/messages", messageRoute);

const PORT = process.env.PORT || 8800;

app.listen(PORT, () => {
  console.log("Backend server is running!");
});
