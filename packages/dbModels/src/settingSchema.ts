import { Schema, model } from 'mongoose'

const SettingSchema = new Schema({
  key: {
    type: String,
    required: true,
  },
  value: {
    type: Schema.Types.Mixed,
    required: true,
  },
})

export const settingsModel = model('setting', SettingSchema)