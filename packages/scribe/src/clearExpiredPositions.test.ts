import { positionSnapshotModel } from '@penny/db-models'
import { clearExpiredPositions } from './clearExpiredPositions'


describe('clearExpiredPositions', () => {
  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(new Date('2021-10-12').getTime())
    positionSnapshotModel.find = jest.fn()
    positionSnapshotModel.deleteMany = jest.fn()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('Doesnt delete any positions if none are expired', async () => {
    // @ts-ignore
    positionSnapshotModel.find.mockReturnValue([
      {
        _id: 1234,
        symbol: 'AAL220429P00018000'
      },
      {
        _id: 4321,
        symbol: 'AAL220429P00018000'
      },
    ])
    await clearExpiredPositions()
    expect(positionSnapshotModel.deleteMany).not.toHaveBeenCalled()
  })

  it('Deletes positions past their expiration', async () => {
    // @ts-ignore
    positionSnapshotModel.find.mockReturnValue([
      {
        _id: 1234,
        symbol: 'AAL200429P00018000'
      },
      {
        _id: 5852,
        symbol: 'AAL210429P00018000'
      },
      {
        _id: 4321,
        symbol: 'AAL220429P00018000'
      },
    ])
    await clearExpiredPositions()
    expect(positionSnapshotModel.deleteMany).toHaveBeenCalledWith({ _id: { $in: [ 1234, 5852 ] } })
  })
})