const express = require("express")
const cors = require("cors")
const app = express()
const Record = require("./models/record")
require("./config/mongoose")
const port = process.env.port || 3000

app.use(cors())
app.use(express.json())


app.get("/records", async(req, res) => {
  const { selectType, startDate, endDate, selectItems } = req.query
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
    query.title = { $in: item }
  }

  try {
    const records = await Record.find(query).lean().sort({date:"desc"})
    return res.status(200).json({
      message: "查詢成功",
      records
    })
  } catch(err){
    console.error(err)
    return res.status(400).json({error: err.message})
  }
})

app.get("/titles", async(req, res) => {
  try{
    const titles = await Record.distinct("title")
    return res.status(200).json({
      message:"查詢成功",
      titles
    })
  } catch(err){
    console.error(err)
    return res.status(400).json({error: err.message})
  }
})

app.post("/record", async(req, res) => {
  const { title, amount, type, date, note } = req.body
  try {
    const record = await Record.create({title, amount, type, date, note})

    return res.status(201).json({
      message: "新增成功",
      record
    })
  } catch(err){
    console.error(err)
    return res.status(400).json({error: err.message})
  }
})

app.put("/records/:id", async(req, res) => {
  const id = req.params.id
  const { title, amount, type, date, note } = req.body

  try {
    const editRecord = await Record.findByIdAndUpdate(
      id,
      { title, amount, type, date, note, updatedAt: new Date() },
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

app.delete("/records/:id", async(req, res) => {
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

app.listen(port, () => {
  console.log(`Server is running on port:${port}`)
})