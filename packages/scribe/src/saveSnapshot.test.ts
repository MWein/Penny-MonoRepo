import { positionSnapshotModel, ICSnapshotModel } from '@penny/db-models'
import * as tradier from '@penny/tradier'
import { saveSnapshot } from './saveSnapshot'
import { generatePositionObject } from '@penny/test-helpers'
jest.mock('@penny/tradier')
jest.mock('@penny/db-models')


describe('saveSnapshot', () => {
  let saveFunc

  beforeEach(() => {
    // @ts-ignore
    tradier.getPrices = jest.fn()
    positionSnapshotModel.find = jest.fn()

    saveFunc = jest.fn()
    // @ts-ignore
    ICSnapshotModel.mockReturnValue({
      save: saveFunc,
    })
  })

  it('Does nothing if there are no positions in the DB', async () => {
    // @ts-ignore
    positionSnapshotModel.find.mockReturnValue([])
    await saveSnapshot()
    expect(tradier.getPrices).not.toHaveBeenCalled()
    expect(saveFunc).not.toHaveBeenCalled()
  })

  it('Saves a position snapshot with gain/loss of 0 if tradier doesnt have a price', async () => {
    // @ts-ignore
    positionSnapshotModel.find.mockReturnValue([
      generatePositionObject('AAPL', 1, 'call', 8, '2021-01-01', 1234, '2021-01-01', 175),
      generatePositionObject('AAPL', -1, 'call', -20, '2021-01-01', 1234, '2021-01-01', 172.5),
    ])
    // @ts-ignore
    tradier.getPrices.mockReturnValue([])

    await saveSnapshot()

    expect(ICSnapshotModel).toHaveBeenCalledWith({
      positions: [
        {
          gainLoss: 0,
          hasCall: true,
          hasPut: false,
          maxGain: 12,
          maxLoss: -238,
          side: 'short',
          ticker: 'AAPL',
        }
      ]
    })
    expect(saveFunc).toHaveBeenCalled()
  })

  it('Saves a position snapshot', async () => {
    // @ts-ignore
    positionSnapshotModel.find.mockReturnValue([
      generatePositionObject('AAPL', 1, 'call', 8, '2021-01-01', 1234, '2021-01-01', 175),
      generatePositionObject('AAPL', -1, 'call', -20, '2021-01-01', 1234, '2021-01-01', 172.5),

      generatePositionObject('AAPL', 1, 'call', 52, '2021-01-01', 1234, '2021-01-02', 170),
      generatePositionObject('AAPL', -1, 'call', -20, '2021-01-01', 1234, '2021-01-02', 172.5),
    ])
    // @ts-ignore
    tradier.getPrices.mockReturnValue([
      {
        symbol: 'AAPL210101C00175000',
        price: 0.12,
      },
      {
        symbol: 'AAPL210101C00172500',
        price: 0.14,
      }
    ])

    await saveSnapshot()

    expect(ICSnapshotModel).toHaveBeenCalledWith({
      positions: [
        {
          gainLoss: 10,
          hasCall: true,
          hasPut: false,
          maxGain: 12,
          maxLoss: -238,
          side: 'short',
          ticker: 'AAPL',
        },
        {
          gainLoss: 0,
          hasCall: true,
          hasPut: false,
          maxGain: 218,
          maxLoss: -32,
          side: 'long',
          ticker: 'AAPL',
        }
      ]
    })
    expect(saveFunc).toHaveBeenCalled()
  })
})