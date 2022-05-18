import { Schema, model } from 'mongoose'

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
    default: new Date().toISOString().split('T')[0]
  },
})

export const RNSModel = model('rnsTest', RNSSchema)