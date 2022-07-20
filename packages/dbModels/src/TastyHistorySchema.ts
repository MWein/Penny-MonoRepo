import { Schema, model } from 'mongoose'

const TastyHistorySchema = new Schema({
  hash: String,
  date: Date,
  underlying: String,
  side: {
    type: String,
    enum: [ 'Buy', 'Sell' ]
  },
  action:  {
    type: String,
    enum: [ 'Open', 'Close' ]
  },
  quantity: Number,
  expiration: String,
  strike: Number,
  optionType: {
    type: String,
    enum: [ 'Call', 'Put' ]
  },
  price: Number,
  fees: Number,
  amount: Number,
})

export const tastyHistoryModel = model('tastyHistory', TastyHistorySchema)