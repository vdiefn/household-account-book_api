const express = require("express")
const router = express.Router()
const record = require("./modules/record")
const category = require("./modules/category")
const summary = require("./modules/summary")

router.use("/records", record)
router.use("/categories", category)
router.use("/summary", summary)

module.exports = router