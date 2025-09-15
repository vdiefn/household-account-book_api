const express = require("express")
const router = express.Router()
const record = require("./modules/record")
const category = require("./modules/category")
const summary = require("./modules/summary")
const user = require("./modules/user")
const passport = require("passport")

router.use("/records", passport.authenticate("jwt", { session: false }), record)
router.use("/categories", passport.authenticate("jwt", { session: false }), category)
router.use("/summary", passport.authenticate("jwt", { session: false }), summary)
router.use("/users", user)

module.exports = router