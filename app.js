const express = require("express")
const app = express()
const port = 3000 || process.env.port

app.get("/", (req, res)=> {
  res.send("Hello from backend api!")
})

app.listen(port, () => {
  console.log(`Server is running on port:${port}`)
})