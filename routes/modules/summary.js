const express = require("express")
const router = express.Router()
const Record = require("../../models/record")
const { getStartOfMonth, getEndOfMonth, getStartOfWeek, getEndOfWeek } = require("../../utils/dayjs")

router.get("/month", async(req, res) => {
  try {
    const startOfMonth = getStartOfMonth()
    const endOfMonth = getEndOfMonth()

    const result = await Record.aggregate([
      {
        $match: {
          date: {
            $gte: startOfMonth, $lte: endOfMonth
          }
        }
      },
      {
        $group: {
          _id: "$type",
          totalAmount: { $sum: "$amount"}
        }
      }
    ])
    const obj = {}
    result.forEach(item => {
      obj[item._id] = item.totalAmount
    })
    return res.status(200).json(obj)
  } catch(err){
    console.error(err)
    return res.status(400).json({error:err.message})
  }
})

router.get("/week", async(req, res) => {
  try {
    const startOfWeek = getStartOfWeek()
    const endOfWeek = getEndOfWeek()

    const result = await Record.aggregate([
      {
        $match: {
          date: {
            $gte: startOfWeek, $lte: endOfWeek
          }
        }
      },
      {
        $group: {
          _id: "$type",
          totalAmount: { $sum : "$amount"}
        }
      }
    ])
    const obj = {}
    result.forEach(item => {
      obj[item._id] = item.totalAmount
    })
    return res.status(200).json(obj)
  } catch(err){
    console.error(err)
    return res.status(400).json({error:err.message})
  }
})

module.exports = router