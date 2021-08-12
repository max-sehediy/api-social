const router = require("express").Router();
const authController = require('../controllers/auth');
const authMiddelware = require("../middleware/authMiddelware");

//REGISTER
router.post("/register", authController.register);

//LOGIN
router.post("/login", authController.login);

// refresh
router.post("/login/refresh", authController.refresh);

// logout
router.post("/login/logout", authController.logout);

module.exports = router;
