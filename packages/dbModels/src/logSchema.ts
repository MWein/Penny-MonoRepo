import { Schema, model } from 'mongoose'

const LogSchema = new Schema({
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  type: {
    type: String,
    required: true,
    enum: [ 'info', 'ping', 'error', 'cron' ],
    default: 'info',
  },
  message: {
    type: String,
    required: true,
  },
})

export const logModel = model('log', LogSchema)