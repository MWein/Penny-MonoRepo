import * as logService from '@penny/logger'
import { getCronTimesController } from './getCronTimes'
import { getMockReq, getMockRes } from '@jest-mock/express'


describe('getCronTimesController', () => {
  let req
  let res

  beforeEach(async () => {
    // @ts-ignore
    logService.getCronLogs = jest.fn()
    const mockRes = getMockRes()
    req = getMockReq()
    res = mockRes.res
  })

  it('Returns 500 error if something fails', async () => {
    // @ts-ignore
    logService.getCronLogs.mockImplementation(() => {
      throw new Error('OH NOOOOO!!!')
    })
    await getCronTimesController(req, res)
    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.send).toHaveBeenCalledWith('Error')
  })

  // Note: The getCronLogs function already returns them in order by date
  // This should return the first occurence for each cron name
  it('Happy path; returns only the latest log for each cronName; sorted in alphabetical order', async () => {
    // @ts-ignore
    logService.getCronLogs.mockReturnValue([
      {
        cronName: 'BSomeCron',
        success: true,
        date: '2021-01-01'
      },
      {
        cronName: 'BSomeCron',
        success: true,
        date: '2021-01-02'
      },
      {
        cronName: 'ASomeOtherCron',
        success: true,
        date: '2021-01-02'
      },
      {
        cronName: 'CYetAnotherCron',
        success: true,
        date: '2021-01-02'
      },
      {
        cronName: 'CYetAnotherCron',
        success: true,
        date: '2050-01-02'
      },
    ])
    await getCronTimesController(req, res)
    expect(res.json).toHaveBeenCalledWith([
      {
        cronName: 'ASomeOtherCron',
        success: true,
        date: '2021-01-02'
      },
      {
        cronName: 'BSomeCron',
        success: true,
        date: '2021-01-01'
      },
      {
        cronName: 'CYetAnotherCron',
        success: true,
        date: '2021-01-02'
      },
    ])
  })
})