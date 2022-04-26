import { positionSnapshotModel } from '@penny/db-models'
import { getExpiration } from '@penny/option-symbol-parser'

// This function clears out any positions that expired
// By option expiration date

export const clearExpiredPositions = async () => {
  const today = new Date()
  const existingModels = await positionSnapshotModel.find()
  const idsToDelete = existingModels.reduce((acc, pos) => {
    const expiration = new Date(getExpiration(pos.symbol))
    return today > expiration ? [ ...acc, pos._id ] : acc
  }, [])

  if (idsToDelete.length > 0) {
    await positionSnapshotModel.deleteMany({ _id: { $in: idsToDelete } })
  }
}