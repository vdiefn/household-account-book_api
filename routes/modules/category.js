const express = require("express")
const router = express.Router()
const Category = require("../../models/category")

router.get("/", async(req, res) => {
  try{
    const categories = await Category.find().select("-__v")
    return res.status(200).json({
      message:"查詢成功",
      categories
    })
  } catch(err){
    console.error(err)
    return res.status(400).json({error: err.message})
  }
})

router.post("/", async(req, res) => {
  const { name } = req.body
  try {
    const result = await Category.create({name})

    return res.status(200).json({
      message: "新增成功",
      result
    })
  } catch(err){
    console.error(err)
    return res.status(400).json({
      error: err.message,
    })
  }
})



module.exports = router