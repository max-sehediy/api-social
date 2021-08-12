const router = require("express").Router();
const userController = require("../controllers/user");

//update user
router.put("/:id", userController.updateUser)

//delete user
router.delete("/:id", userController.deleteUser);

//get a user
router.get("/", userController.getUser);

//get friends
router.get("/friends/:userId", userController.getFriends);

//follow a user

router.put("/:id/follow", userController.followUser);

//unfollow a user

router.put("/:id/unfollow", userController.unFollowUser);

router.get('/all', userController.getAllUsers)

module.exports = router;
