const User = require("../../models/user")
const express = require("express")
const router = express.Router()
const passport = require("passport")
const jwt = require("jsonwebtoken")


router.post("/register", async(req, res) => {
  const { name, email, password, confirmPassword } = req.body
  try {
    const existingUser = await User.findOne({email})
    if(existingUser) {
      return res.status(400).json({message: "user already exist"})
    }
    const newUser = await User.create({email, name, password})
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

router.post("/login", passport.authenticate("local", { session:false }), (req, res) => {
  try {
    const userData = req.user.toJSON()
    delete userData.password
    const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: "30d"})
    res.json({
      status: "success",
      data: {
        token,
        user: userData
      }
    })
  } catch(err) {
    return res.status(500).json({error: err.message})
  }
})

router.get("/logout", (req, res) => {
  return res.json({
    status: "success",
    message: "Logout successfully"
  })
})

module.exports = router