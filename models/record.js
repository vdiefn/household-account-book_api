const mongoose = require("mongoose")
const Schema = mongoose.Schema
const recordSchema = new Schema({
  userId: {
    type:Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true
  },
  title: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  type: "income" | "expense",
  data: {
    type: Date,
    required: true
  },
  note: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model("Record", recordSchema)