import { Schema, model } from 'mongoose'

const WatchlistSchema = new Schema({
  symbol: {
    type: String,
    required: true,
  },
  maxPositions: {
    type: Number,
    required: true,
    default: 0,
  },
  volatility: {
    type: Number,
    required: false,
  },
  call: {
    enabled: {
      type: Boolean,
      required: true,
      default: false,
    },
    targetDelta: {
      type: Number,
      required: true,
      default: 0.3,
      min: [0.1],
      max: [1]
    },
    minStrikeMode: {
      type: String,
      required: true,
      default: 'auto',
      enum: [ 'auto', 'custom', 'off' ]
    },
    minStrike: {
      type: Number,
      required: false,
    }
  },
  put: {
    enabled: {
      type: Boolean,
      required: true,
      default: false,
    },
    targetDelta: {
      type: Number,
      required: true,
      default: 0.3,
      min: [0.1],
      max: [1]
    },
  }
})

export const watchlistModel = model('watchlist', WatchlistSchema)