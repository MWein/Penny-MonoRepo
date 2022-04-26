import * as tradier from '@penny/tradier'
import { positionSnapshotModel } from '@penny/db-models'
import { savePositions } from './savePositions'
import { generatePositionObject } from '@penny/test-helpers'
jest.mock('@penny/tradier')

describe('savePositions', () => {
  beforeEach(() => {
    // @ts-ignore
    tradier.getPositions = jest.fn()
    positionSnapshotModel.find = jest.fn()
    positionSnapshotModel.insertMany = jest.fn()
  })

  it('Does nothing if there arent any positions', async () => {
    // @ts-ignore
    tradier.getPositions.mockReturnValue([])
    await savePositions()
    expect(positionSnapshotModel.find).not.toHaveBeenCalled()
    expect(positionSnapshotModel.insertMany).not.toHaveBeenCalled()
  })

  it('Saves all positions if there arent any in the DB', async () => {
    // @ts-ignore
    tradier.getPositions.mockReturnValue([
      generatePositionObject('AAPL', 1, 'call', 10, '2021-01-01', 1234, '2021-02-02', 124),
      generatePositionObject('AAPL', -1, 'call', 10, '2021-01-01', 1234, '2021-02-02', 125),
    ])
    // @ts-ignore
    positionSnapshotModel.find.mockReturnValue([])
    await savePositions()
    expect(positionSnapshotModel.insertMany).toHaveBeenCalledWith([
      generatePositionObject('AAPL', 1, 'call', 10, '2021-01-01', 1234, '2021-02-02', 124),
      generatePositionObject('AAPL', -1, 'call', 10, '2021-01-01', 1234, '2021-02-02', 125),
    ])
  })

  it('Only saves positions that arent yet in the DB', async () => {
    // @ts-ignore
    tradier.getPositions.mockReturnValue([
      generatePositionObject('AAPL', 1, 'call', 10, '2021-01-01', 1234, '2021-02-02', 124),
      generatePositionObject('TSLA', -1, 'call', 10, '2021-01-01', 1234, '2021-02-02', 125),
    ])
    // @ts-ignore
    positionSnapshotModel.find.mockReturnValue([
      generatePositionObject('AAPL', 1, 'call', 10, '2021-01-01', 1234, '2021-02-02', 124),
    ])
    await savePositions()
    expect(positionSnapshotModel.insertMany).toHaveBeenCalledWith([
      generatePositionObject('TSLA', -1, 'call', 10, '2021-01-01', 1234, '2021-02-02', 125),
    ])
  })
})