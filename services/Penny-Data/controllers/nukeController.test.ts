import * as nukeService from '../services/nuke'
import { nukeController } from './nukeController'
import { getMockReq, getMockRes } from '@jest-mock/express'


describe('nukeController', () => {
  let req
  let res
  
  beforeEach(async () => {
    // @ts-ignore
    nukeService.nuke = jest.fn()
    const mockRes = getMockRes()
    req = getMockReq()
    res = mockRes.res
  })

  it('Returns error if bad type given', async () => {
    req = getMockReq({ query: { type: 'badtype' } })
    // @ts-ignore
    await nukeController(req, res)
    expect(nukeService.nuke).not.toHaveBeenCalled()
    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.send).toHaveBeenCalledWith('Error')
  })

  it('Returns 500 error if something fails', async () => {
    req = getMockReq({ query: { type: 'all' } })
    // @ts-ignore
    nukeService.nuke.mockImplementation(() => {
      throw new Error('OH NOOOOO!!!')
    })
    await nukeController(req, res)
    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.send).toHaveBeenCalledWith('Error')
  })

  it('Calls nuke with "all" and returns 200', async () => {
    req = getMockReq({ query: { type: 'all' } })
    await nukeController(req, res)
    expect(nukeService.nuke).toHaveBeenCalledWith('all')
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.send).toHaveBeenCalledWith('Success')
  })

  it('Calls nuke with "short" and returns 200', async () => {
    req = getMockReq({ query: { type: 'short' } })
    await nukeController(req, res)
    expect(nukeService.nuke).toHaveBeenCalledWith('short')
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.send).toHaveBeenCalledWith('Success')
  })

  it('Calls nuke with "long" and returns 200', async () => {
    req = getMockReq({ query: { type: 'long' } })
    await nukeController(req, res)
    expect(nukeService.nuke).toHaveBeenCalledWith('long')
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.send).toHaveBeenCalledWith('Success')
  })
})