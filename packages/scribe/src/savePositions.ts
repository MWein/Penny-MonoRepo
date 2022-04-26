import * as tradier from '@penny/tradier'
import { isOption } from '@penny/option-symbol-parser'
import { positionSnapshotModel } from '@penny/db-models'

// This function takes a snapshot of the current positions directly from Tradier
// It will add positions, but it will never delete them

export const savePositions = async () => {
  const positions = await tradier.getPositions()
  const optionPositions = positions.filter(pos => isOption(pos.symbol))

  if (optionPositions.length === 0) {
    return
  }

  const existingModels = await positionSnapshotModel.find()
  const existingSymbols = existingModels.map(model => model.symbol)
  const newPositions = optionPositions.filter(pos => !existingSymbols.includes(pos.symbol))
  await positionSnapshotModel.insertMany(newPositions)
}
