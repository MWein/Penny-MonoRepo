import * as pennyStatusUtil from '../services/pennyStatus'
import { pennyStatusController } from './pennyStatus'
import { getMockReq, getMockRes } from '@jest-mock/express'


describe('pennyStatusController', () => {
  let req
  let res
  
  beforeEach(async () => {
    (pennyStatusUtil.getLastLogDate as unknown as jest.Mock) = jest.fn()
    const mockRes = getMockRes()
    req = getMockReq()
    res = mockRes.res
  })

  it('Returns 500 error if something fails', async () => {
    (pennyStatusUtil.getLastLogDate as unknown as jest.Mock).mockImplementation(() => {
      throw new Error('OH NOOOOO!!!')
    })
    await pennyStatusController(req, res)
    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.send).toHaveBeenCalledWith('Error')
  })

  it('Returns unhealthy', async () => {
    (pennyStatusUtil.getLastLogDate as unknown as jest.Mock).mockReturnValue('2020-01-01')
    await pennyStatusController(req, res)
    expect(res.json).toHaveBeenCalledWith({
      healthy: false,
    })
  })

  it('Happy path', async () => {
    jest.useFakeTimers().setSystemTime(new Date('2020-01-01').getTime());
    (pennyStatusUtil.getLastLogDate as unknown as jest.Mock).mockReturnValue('2020-01-01')
    await pennyStatusController(req, res)
    expect(res.json).toHaveBeenCalledWith({
      healthy: true,
    })
    jest.useRealTimers()
  })
})