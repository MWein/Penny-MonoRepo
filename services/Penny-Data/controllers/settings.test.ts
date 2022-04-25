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
    // @ts-ignore
    settingsService.getSettings = jest.fn()
    const mockRes = getMockRes()
    req = getMockReq()
    res = mockRes.res
  })

  it('Returns 500 error if something fails', async () => {
    // @ts-ignore
    settingsService.getSettings.mockImplementation(() => {
      throw new Error('OH NOOOOO!!!')
    })
    await getSettingsController(req, res)
    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.send).toHaveBeenCalledWith('Error')
  })

  it('Happy path', async () => {
    // @ts-ignore
    settingsService.getSettings.mockReturnValue({
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
    // @ts-ignore
    settingsService.setSettings = jest.fn()
    const mockRes = getMockRes()
    req = getMockReq({ body: { some: 'newSetting' } })
    res = mockRes.res
  })

  it('Returns 500 error if something fails', async () => {
    // @ts-ignore
    settingsService.setSettings.mockImplementation(() => {
      throw new Error('OH NOOOOO!!!')
    })
    await setSettingsController(req, res)
    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.send).toHaveBeenCalledWith('Error')
  })

  it('Happy path, edits setting from request body', async () => {
    // @ts-ignore
    settingsService.setSettings.mockReturnValue({
      thisIs: 'whatgetssenttotheuser'
    })
    await setSettingsController(req, res)
    expect(settingsService.setSettings).toHaveBeenCalledWith({ some: 'newSetting' })
    expect(res.json).toHaveBeenCalledWith({
      thisIs: 'whatgetssenttotheuser'
    })
  })
})