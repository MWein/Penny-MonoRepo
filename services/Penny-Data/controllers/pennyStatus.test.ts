import * as pennyStatusUtil from '../services/pennyStatus'
import { pennyStatusController } from './pennyStatus'
import { getMockReq, getMockRes } from '@jest-mock/express'


describe('pennyStatusController', () => {
  let req
  let res
  
  beforeEach(async () => {
    // @ts-ignore
    pennyStatusUtil.getLastLogDate = jest.fn()
    const mockRes = getMockRes()
    req = getMockReq()
    res = mockRes.res
  })

  it('Returns 500 error if something fails', async () => {
    // @ts-ignore
    pennyStatusUtil.getLastLogDate.mockImplementation(() => {
      throw new Error('OH NOOOOO!!!')
    })
    await pennyStatusController(req, res)
    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.send).toHaveBeenCalledWith('Error')
  })

  it('Returns unhealthy', async () => {
    // @ts-ignore
    pennyStatusUtil.getLastLogDate.mockReturnValue('2020-01-01')
    await pennyStatusController(req, res)
    expect(res.json).toHaveBeenCalledWith({
      healthy: false,
    })
  })

  it('Happy path', async () => {
    jest.useFakeTimers().setSystemTime(new Date('2020-01-01').getTime());
    // @ts-ignore
    pennyStatusUtil.getLastLogDate.mockReturnValue('2020-01-01')
    await pennyStatusController(req, res)
    expect(res.json).toHaveBeenCalledWith({
      healthy: true,
    })
    jest.useRealTimers()
  })
})