// internal require
const express = require("express")
const { RegesterUser, verify, loginUser } = require("../controller/userController")

function generateOTpId() {
    return uuidv4();
  }

//exChange to Express to router
const router = express.Router()

 router.route('/regester').post(RegesterUser )
 router.route(`/regester/verify`).post(verify)
 router.route('/login').post(loginUser)

module.exports = router