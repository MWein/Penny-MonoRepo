import { Schema, model } from 'mongoose'

const PriceHistorySchema = new Schema({
  symbol: String,
  price: Number,
  date: Date,
})

export const PriceHistoryModel = model('rnsPriceHistory', PriceHistorySchema)