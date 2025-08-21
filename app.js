const express = require("express")
const cors = require("cors")
const app = express()
require("./config/mongoose")
const port = process.env.port || 3000
const routes = require("./routes")

app.use(cors())
app.use(express.json())
app.use(routes)

app.listen(port, () => {
  console.log(`Server is running on port:${port}`)
})