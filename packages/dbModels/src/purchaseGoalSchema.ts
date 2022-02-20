import { Schema, model } from 'mongoose'

const PurchaseGoalSchema = new Schema({
  symbol: {
    type: String,
    required: true,
  },
  enabled: {
    type: Boolean,
    required: true,
    default: true,
  },
  priority: {
    type: Number,
    required: true,
    default: 0, // Higher the number, higher the priority
  },
  goal: {
    type: Number,
    required: true,
  },
  fulfilled: {
    type: Number,
    required: true,
    default: 0,
  }
})

export const purchaseGoalModel = model('purchaseGoal', PurchaseGoalSchema)