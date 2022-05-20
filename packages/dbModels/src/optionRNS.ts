import { Schema, model } from 'mongoose'

const getCurrentDate = () => new Date().toISOString().split('T')[0]

const RNSSchema = new Schema({
  symbol: String,
  underlying: String,
  type: String,
  strike: Number,
  premium: Number,
  expiration: String,
  delta: Number,
  price: Number,
  perc: Number,
  diff: Number,
  date: {
    type: String,
    default: getCurrentDate
  },
})

export const RNSModel = model('rnsTest', RNSSchema)