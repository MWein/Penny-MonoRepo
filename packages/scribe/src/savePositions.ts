import * as tradier from '@penny/tradier'
import { positionSnapshotModel } from '@penny/db-models'

// This function takes a snapshot of the current positions directly from Tradier
// It will add positions, but it will never delete them

export const savePositions = async () => {
  const positions = await tradier.getPositions()
  const existingModels = await positionSnapshotModel.find()
  const existingSymbols = existingModels.map(model => model.symbol)
  const newPositions = positions.filter(pos => !existingSymbols.includes(pos.symbol))
  await positionSnapshotModel.insertMany(newPositions)
}
