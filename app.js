const express = require("express")
const cors = require("cors")
const app = express()
const mongoose = require("mongoose")

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

app.get("/", (req, res)=> {
  res.send("Hello from backend api!")
})

app.listen(port, () => {
  console.log(`Server is running on port:${port}`)
})