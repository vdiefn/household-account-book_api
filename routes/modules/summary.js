const express = require("express")
const router = express.Router()
const Record = require("../../models/record")
const { getStartOfMonth, getEndOfMonth, getStartOfWeek, getEndOfWeek, getDaysInMonth } = require("../../utils/dayjs")

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

router.get("/month-trend", async(req, res) => {
  const startOfMonth = getStartOfMonth()
  const endOfMonth = getEndOfMonth()
  const daysInMonth = getDaysInMonth()

  try{
    const result = await Record.aggregate([
      {
        $match: {
          date: {
            $gte: startOfMonth,
            $lte: endOfMonth
          }
        }
      },
      {
        $group: {
          _id: {
            type: "$type",
            date: {
              $dayOfMonth: "$date"
            },
          },
          totalAmount: {$sum: "$amount"}
        },
      },
      {
        $group: {
          _id: "$_id.date",
          income: {
            $sum: { $cond: [{$eq: ["$_id.type", "income"]}, "$totalAmount", 0]}
          },
          expense: {
            $sum: { $cond: [{$eq: ["$_id.type", "expense"]}, "$totalAmount", 0]}
          }
        }
      },
      {
        $sort: {
          _id: 1
        }
      },
      {
        $project: {
          _id: 0,
          day: "$_id",
          income:1,
          expense: 1
        }
      }
    ])

    for(let i = 1; i <= daysInMonth; i++) {
      if(!result.find(item => item.day===i)){
        result.push({
          "income":0,
          "expense":0,
          "day":i
        })
      }
    }

    return res.status(200).json(result.sort((a,b) => a.day-b.day))

  } catch(err){
    console.error(err)
    return res.status(400).json({error: err.message})
  }
})

module.exports = router