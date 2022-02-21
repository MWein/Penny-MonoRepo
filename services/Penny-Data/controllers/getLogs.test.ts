import * as logService from '@penny/logger'
import { getLogsController } from './getLogs'
import { getMockReq, getMockRes } from '@jest-mock/express'


describe('getLogsController', () => {
  let req
  let res

  beforeEach(async () => {
    // @ts-ignore
    logService.getLogs = jest.fn()
    const mockRes = getMockRes()
    req = getMockReq()
    res = mockRes.res
  })

  it('Returns 500 error if something fails', async () => {
    // @ts-ignore
    logService.getLogs.mockImplementation(() => {
      throw new Error('OH NOOOOO!!!')
    })
    await getLogsController(req, res)
    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.send).toHaveBeenCalledWith('Error')
  })

  it('Happy path', async () => {
    // @ts-ignore
    logService.getLogs.mockReturnValue({
      something: 'whatever'
    })
    await getLogsController(req, res)
    expect(res.json).toHaveBeenCalledWith({
      something: 'whatever'
    })
  })
})