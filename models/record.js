const mongoose = require("mongoose")
const Schema = mongoose.Schema
const recordSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    enum: ["income", "expense"],
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  note: String,
  category: {
    type: Schema.Types.ObjectId,
    ref: "Category",
    required: true
  }
},{
    timestamps: true,
    versionKey: false
  })

module.exports = mongoose.model("Record", recordSchema)