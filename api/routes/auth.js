const router = require("express").Router();
const authController = require('../controllers/auth');
const authMiddelware = require("../middleware/authMiddelware");
//REGISTER
router.post("/register", authController.register);

//LOGIN
router.post("/login", authController.login);
// delete
router.delete("/login/:userId", authMiddelware, authController.delete);

// refresh
router.post("/login/refresh", authMiddelware, authController.refresh);

// logout
router.post("/login/logout", authMiddelware, authController.logout);

module.exports = router;
