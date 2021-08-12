const router = require("express").Router();
const Post = require("../models/Post");
const User = require("../models/User");
const postController = require('../controllers/posts')

//create a post
router.post("/", postController.createPost);

//update a post
router.put("/:id", postController.updatePost);

//delete a post
router.delete("/:id", postController.deletePost);

//like / dislike a post
router.put("/:id/like", postController.likeDislikePost);

//get a post
router.get("/:id", postController.getPost);

//get timeline posts
router.get("/timeline/:userId", postController.getTimelinePosts);

//get user's all posts
router.get("/profile/:username", postController.userAllPosts);

module.exports = router;
