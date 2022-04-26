import { Schema, model } from 'mongoose'

const ICPosition = new Schema({
  ticker: String,
  side: {
    type: String,
    enum: [ 'long', 'short' ],
  },
  gainLoss: Number,
  maxLoss: Number,
  maxGain: Number,
  hasPut: Boolean,
  hasCall: Boolean,
})

const ICSnapshotSchema = new Schema({
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  positions: [ICPosition]
})

export const ICSnapshotModel = model('ICSnapshot', ICSnapshotSchema)