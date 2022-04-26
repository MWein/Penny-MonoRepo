import { Schema, model } from 'mongoose'

const PositionSnapshotSchema = new Schema({
  id: Number,
  symbol: String,
  cost_basis: Number,
  quantity: Number,
  date_acquired: String,
})

export const positionSnapshotModel = model('positionSnapshot', PositionSnapshotSchema)