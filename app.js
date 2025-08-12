const express = require("express")
const cors = require("cors")
const app = express()
const mongoose = require("mongoose")
const Record = require("./models/record")

if(process.env.NODE_ENV !== "production") {
    require("dotenv").config()
}

mongoose.connect(process.env.MONGODB_URI)

const port = process.env.port || 3000
const db = mongoose.connection

db.on("error", () => {
  console.log("mongodb error!")
})

db.once("open", () => {
  console.log("mongodb connected")
})

app.use(cors())
app.use(express.json())

// app.get("/", (req, res)=> {
//   res.send("Hello from backend api!")
// })

app.get("/", async(req, res) => {
  try {
    const records = await Record.find()
    return res.status(201).json({
      message: "查詢成功",
      records
    })
  } catch(err){
    console.error(err)
    return res.status(400).send({error: err.message})
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
    return res.status(400).send({error: err.message})
  }
})

app.put("/records/:id", async(req, res) => {
  const id = req.params.id
  const { title, amount, type, date, note } = req.body

  try {
    const record = await Record.findByIdAndUpdate(
      id,
      { title, amount, type, date, note, updatedAt: new Date() }
    )

    if(!record) {
      return res.status(404).json({message: "找不到該筆資料"})
    }

    return res.status(200).json({
      message: "修改成功",
      record
    })
  } catch(err){
    console.error(err)
    return res.status(400).json({error: err.message})
  }
})

app.listen(port, () => {
  console.log(`Server is running on port:${port}`)
})