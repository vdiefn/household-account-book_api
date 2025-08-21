const express = require("express")
const router = express.Router()
const record = require("./modules/record")
const category = require("./modules/category")

router.use("/records", record)
router.use("/categories", category)

module.exports = router