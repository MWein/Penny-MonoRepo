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
    // @ts-ignore
    settingsModel.find.mockImplementation(() => {
      throw new Error('Damn')
    })
    const settings = await getSettings()
    expect(settings).toEqual(defaultSettings)
  })

  it('Returns all default settings if find returns nothing', async () => {
    // @ts-ignore
    settingsModel.find.mockReturnValue([])
    const settings = await getSettings()
    expect(settings).toEqual(defaultSettings)
  })

  it('Returns settings intermixed with default settings', async () => {
    // @ts-ignore
    settingsModel.find.mockReturnValue([
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
    // @ts-ignore
    settingsModel.findOne.mockImplementation(() => {
      throw new Error('Damn')
    })
    const result = await getSetting('longTargetDelta')
    expect(result).toEqual(defaultSettings.longTargetDelta)
  })

  it('Returns a default setting if Mongo doesnt have it', async () => {
    // @ts-ignore
    settingsModel.findOne.mockReturnValue(null)
    const result = await getSetting('longTargetDelta')
    expect(result).toEqual(defaultSettings.longTargetDelta)
  })

  it('Returns setting from mongo', async () => {
    // @ts-ignore
    settingsModel.findOne.mockReturnValue({ key: 'longTargetDelta', value: 20 })
    const result = await getSetting('longTargetDelta')
    expect(result).toEqual(20)
  })
})


describe('setSettings', () => {
  beforeEach(() => {
    settingsModel.find = jest.fn()
    settingsModel.findOneAndUpdate = jest.fn()
  })

  it('If empty object, just returns default settings', async () => {
    // @ts-ignore
    settingsModel.find.mockReturnValue([])
    const newSettings = await setSettings({})
    expect(newSettings).toEqual(defaultSettings)
    expect(settingsModel.findOneAndUpdate).not.toHaveBeenCalled()
  })

  it('Updates for each setting updated', async () => {
    // @ts-ignore
    settingsModel.find.mockReturnValue([])
    const newSettings = await setSettings({
      longICEnabled: false,
      longICSymbols: [ 'SPY', 'IWM' ],
      longTargetStrikeWidth: 0.50
    })
    expect(newSettings).toEqual(defaultSettings)
    expect(settingsModel.findOneAndUpdate).toHaveBeenCalledTimes(3)

    expect(settingsModel.findOneAndUpdate).toHaveBeenCalledWith(
      { key: 'longICEnabled' },
      { key: 'longICEnabled', value: false },
      { upsert: true }
    )
    expect(settingsModel.findOneAndUpdate).toHaveBeenCalledWith(
      { key: 'longICSymbols' },
      { key: 'longICSymbols', value: [ 'SPY', 'IWM' ] },
      { upsert: true }
    )
    expect(settingsModel.findOneAndUpdate).toHaveBeenCalledWith(
      { key: 'longTargetStrikeWidth' },
      { key: 'longTargetStrikeWidth', value: 0.50 },
      { upsert: true }
    )
  })
})