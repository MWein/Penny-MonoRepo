import * as settingsService from '@penny/settings'
import {
  getSettingsController,
  setSettingsController,
} from './settings'
import { getMockReq, getMockRes } from '@jest-mock/express'


describe('getSettingsController', () => {
  let req
  let res
  
  beforeEach(async () => {
    (settingsService.getSettings as unknown as jest.Mock) = jest.fn()
    const mockRes = getMockRes()
    req = getMockReq()
    res = mockRes.res
  })

  it('Returns 500 error if something fails', async () => {
    (settingsService.getSettings as unknown as jest.Mock).mockImplementation(() => {
      throw new Error('OH NOOOOO!!!')
    })
    await getSettingsController(req, res)
    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.send).toHaveBeenCalledWith('Error')
  })

  it('Happy path', async () => {
    (settingsService.getSettings as unknown as jest.Mock).mockReturnValue({
      something: 'whatever'
    })
    await getSettingsController(req, res)
    expect(res.json).toHaveBeenCalledWith({
      something: 'whatever'
    })
  })
})


describe('setSettingsController', () => {
  let req
  let res
  
  beforeEach(async () => {
    (settingsService.setSettings as unknown as jest.Mock) = jest.fn()
    const mockRes = getMockRes()
    req = getMockReq({ body: { some: 'newSetting' } })
    res = mockRes.res
  })

  it('Returns 500 error if something fails', async () => {
    (settingsService.setSettings as unknown as jest.Mock).mockImplementation(() => {
      throw new Error('OH NOOOOO!!!')
    })
    await setSettingsController(req, res)
    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.send).toHaveBeenCalledWith('Error')
  })

  it('Happy path, edits setting from request body', async () => {
    (settingsService.setSettings as unknown as jest.Mock).mockReturnValue({
      thisIs: 'whatgetssenttotheuser'
    })
    await setSettingsController(req, res)
    expect(settingsService.setSettings).toHaveBeenCalledWith({ some: 'newSetting' })
    expect(res.json).toHaveBeenCalledWith({
      thisIs: 'whatgetssenttotheuser'
    })
  })
})