const express = require("express")
const router = express.Router()
const Record = require("../../models/record")
const mongoose = require("mongoose")

router.get("/", async(req, res) => {
  const { selectType, startDate, endDate, selectItems, selectCategories } = req.query
  const query = {}

  if(selectType) {
    const type = Array.isArray(selectType)? selectType : [selectType]
    query.type = {$in: type}
  }

  if(startDate || endDate){
    query.date = {}
    if(startDate) {
      query.date.$gte = new Date(startDate)
    }
    if(endDate) {
      const end = new Date(endDate)
      end.setHours(23, 59, 59, 999)
      query.date.$lte = end
    }
  }

  if(selectItems) {
    const item = Array.isArray(selectItems)? selectItems : [selectItems]
    query.name = { $in: item }
  }

  if(selectCategories) {
    const category = Array.isArray(selectCategories)? selectCategories : [selectCategories]
    query.category = { $in: category.map(id => new mongoose.Types.ObjectId(id)) }
  }

  try {
    const records = await Record.find(query).populate("category", "name").lean().sort({date:"desc"})
    return res.status(200).json({
      message: "查詢成功",
      records
    })
  } catch(err){
    console.error(err)
    return res.status(400).json({error: err.message})
  }
})

router.post("/", async(req, res) => {
  const { name, amount, type, date, note, category } = req.body
  try {
    const record = await Record.create({name, amount, type, date, note, category})

    return res.status(200).json({
      message: "新增成功",
      record
    })
  } catch(err){
    console.error(err)
    return res.status(400).json({error: err.message})
  }
})

router.put("/:id", async(req, res) => {
  const id = req.params.id
  const { name, amount, type, date, note } = req.body

  try {
    const editRecord = await Record.findByIdAndUpdate(
      id,
      { name, amount, type, date, note, updatedAt: new Date() },
      { new: true}
    )

    if(!editRecord) {
      return res.status(404).json({message: "找不到該筆資料"})
    }

    return res.status(200).json({
      message: "修改成功",
      editRecord,
    })
  } catch(err){
    console.error(err)
    return res.status(400).json({error: err.message})
  }
})
router.delete("/:id", async(req, res) => {
  const id = req.params.id
  try {
    const result = await Record.deleteOne({_id:id})

    if(result.deletedCount === 0){
      return res.status(404).json({message: "找不到該筆資料"})
    }

    return res.status(200).json({message: "刪除成功"})
  } catch(err){
    console.error(err)
    return res.status(404).json({error: err.message})
  }
})


module.exports = router