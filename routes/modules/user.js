const User = require("../../models/user")
const express = require("express")
const router = express.Router()
const passport = require("passport")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")


router.post("/register", async(req, res) => {
  const { name, email, password, confirmPassword } = req.body
  try {
    const existingUser = await User.findOne({email})
    if(existingUser) {
      return res.status(400).json({message: "user already exist"})
    }
    const salt = await bcrypt.genSalt(10)
    const hash = bcrypt.hash(password, salt)
    const newUser = await User.create({email, name, password: hash})
    return res.json({
      status: "success",
      message: "user created successfully",
      user: newUser
    })
  } catch(err){
    console.error(err)
    return res.status(500).json({error: err.message})
  }
})

router.post("/login", (req, res, next) => {
  passport.authenticate("local", { session:false }, (err, user, info) => {
    if(err) {
      return res.status(500).json({
        status: "error",
        error: err.message || "Server error"
      })
    }

    if(!user) {
      return res.status(401).json({
        status: "error",
        error: info.message || "Unauthorized"
      })
    }

    try {
      const userData = user.toJSON()
      delete userData.password
      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: "30d"})
      return res.status(200).json({
        status: "success",
        token,
        user: userData
      })
    } catch(err) {
      return res.status(500).json({error: err.message})
    }
})(req, res, next)})

router.get("/logout", (req, res) => {
  return res.json({
    status: "success",
    message: "Logout successfully"
  })
})

module.exports = router