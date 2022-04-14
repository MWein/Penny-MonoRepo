import { Schema, model } from 'mongoose'

const CronMonitoringSchema = new Schema({
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  cronName: {
    type: String,
    required: true,
  },
  success: {
    type: Boolean,
    required: true,
  },
  errorMessage: {
    type: String,
    required: false,
  }
})

export const cronModel = model('cron', CronMonitoringSchema)