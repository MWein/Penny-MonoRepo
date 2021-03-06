import * as tradier from '@penny/tradier'
import { sellPositionsController } from './sellPositionsController'
import { getMockReq, getMockRes } from '@jest-mock/express'
jest.mock('@penny/tradier')

describe('sellPositionsController', () => {
  let req
  let res
  
  beforeEach(async () => {
    // @ts-ignore
    tradier.closePositionsIndividual = jest.fn()
    const mockRes = getMockRes()
    req = getMockReq()
    res = mockRes.res
  })

  it('Returns 500 if something fails', async () => {
    // @ts-ignore
    tradier.closePositionsIndividual.mockImplementation(() => {
      throw new Error('OH NOOOOO!!!')
    })
    await sellPositionsController(req, res)
    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.send).toHaveBeenCalledWith('Error')
  })

  it('Calls sellPositions service with body', async () => {
    const body = [
      {
        some: 'position'
      }
    ]
    req = getMockReq({ body })
    await sellPositionsController(req, res)
    expect(tradier.closePositionsIndividual).toHaveBeenCalledWith(body)
    expect(res.send).toHaveBeenCalledWith('Done')
  })
})