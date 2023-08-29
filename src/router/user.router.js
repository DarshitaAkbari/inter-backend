const router = require("express").Router();

const {
  userRegister,
  viewAllUsers,
  userLogin,
  deleteUser,
  userDetails,
  sendRequest,
  acceptRequest,
} = require("../controller/user.controller");

router.post("/register", userRegister);
router.get("/viewAll", viewAllUsers);
router.post("/login", userLogin);
router.get("/viewById/:id", userDetails);
router.delete("/deleteUser/:id", deleteUser);
router.post("/follow/:userID", sendRequest);
router.post("/following/:userID", acceptRequest);

module.exports = router;
