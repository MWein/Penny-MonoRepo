import { settingsModel } from '@penny/db-models'

import {
  defaultSettings,
  getSettings,
  getSetting,
  setSettings,
} from './index'


describe('getSettings', () => {
  beforeEach(() => {
    settingsModel.find = jest.fn()
  })

  it('Returns all default settings if an error is thrown', async () => {
    (settingsModel.find as unknown as jest.Mock).mockImplementation(() => {
      throw new Error('Damn')
    })
    const settings = await getSettings()
    expect(settings).toEqual(defaultSettings)
  })

  it('Returns all default settings if find returns nothing', async () => {
    (settingsModel.find as unknown as jest.Mock).mockReturnValue([])
    const settings = await getSettings()
    expect(settings).toEqual(defaultSettings)
  })

  it('Returns settings intermixed with default settings', async () => {
    (settingsModel.find as unknown as jest.Mock).mockReturnValue([
      {
        key: 'putsEnabled',
        value: false
      },
      {
        key: 'reserve',
        value: 2000
      },
    ])
    const settings = await getSettings()
    expect(settings).toEqual({
      ...defaultSettings,
      putsEnabled: false,
      reserve: 2000
    })
  })
})


describe('getSetting', () => {
  beforeEach(() => {
    settingsModel.findOne = jest.fn()
  })

  it('Returns a default setting if findOne throws', async () => {
    (settingsModel.findOne as unknown as jest.Mock).mockImplementation(() => {
      throw new Error('Damn')
    })
    const result = await getSetting('reserve')
    expect(result).toEqual(defaultSettings.reserve)
  })

  it('Returns a default setting if Mongo doesnt have it', async () => {
    (settingsModel.findOne as unknown as jest.Mock).mockReturnValue(null)
    const result = await getSetting('reserve')
    expect(result).toEqual(defaultSettings.reserve)
  })

  it('Returns setting from mongo', async () => {
    (settingsModel.findOne as unknown as jest.Mock).mockReturnValue({ key: 'reserve', value: 20 })
    const result = await getSetting('reserve')
    expect(result).toEqual(20)
  })
})


describe('setSettings', () => {
  beforeEach(() => {
    settingsModel.find = jest.fn()
    settingsModel.findOneAndUpdate = jest.fn()
  })

  it('If empty object, just returns settings', async () => {
    (settingsModel.find as unknown as jest.Mock).mockReturnValue([])
    const newSettings = await setSettings({})
    expect(newSettings).toEqual(defaultSettings)
    expect(settingsModel.findOneAndUpdate).not.toHaveBeenCalled()
  })

  it('Updates for each setting updated', async () => {
    (settingsModel.find as unknown as jest.Mock).mockReturnValue([])
    const newSettings = await setSettings({
      callsEnabled: false,
      putsEnabled: true,
      reserve: -100
    })
    expect(newSettings).toEqual(defaultSettings)
    expect(settingsModel.findOneAndUpdate).toHaveBeenCalledTimes(3)

    expect(settingsModel.findOneAndUpdate).toHaveBeenCalledWith(
      { key: 'callsEnabled' },
      { key: 'callsEnabled', value: false },
      { upsert: true }
    )
    expect(settingsModel.findOneAndUpdate).toHaveBeenCalledWith(
      { key: 'putsEnabled' },
      { key: 'putsEnabled', value: true },
      { upsert: true }
    )
    expect(settingsModel.findOneAndUpdate).toHaveBeenCalledWith(
      { key: 'reserve' },
      { key: 'reserve', value: -100 },
      { upsert: true }
    )
  })
})