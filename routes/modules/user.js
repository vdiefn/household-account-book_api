const User = require("../../models/user")
const express = require("express")
const router = express.Router()
const passport = require("passport")


router.post("/register", async(req, res) => {
  const { name, email, password, confirmPassword } = req.body
  try {
    const existingUser = await User.findOne({email})
    if(existingUser) {
      return res.status(400).json({message: "user already exist"})
    }
    const newUser = await User.create({email, name, password})
    return res.status(200).json({message: "user created successfully", user: newUser})
  } catch(err){
    console.error(err)
    return res.status(500).json({error: err.message})
  }
})

module.exports = router