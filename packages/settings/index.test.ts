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
    const result = await getSetting('maximumPricePerSpread')
    expect(result).toEqual(defaultSettings.maximumPricePerSpread)
  })

  it('Returns a default setting if Mongo doesnt have it', async () => {
    (settingsModel.findOne as unknown as jest.Mock).mockReturnValue(null)
    const result = await getSetting('maximumPricePerSpread')
    expect(result).toEqual(defaultSettings.maximumPricePerSpread)
  })

  it('Returns setting from mongo', async () => {
    (settingsModel.findOne as unknown as jest.Mock).mockReturnValue({ key: 'maximumPricePerSpread', value: 20 })
    const result = await getSetting('maximumPricePerSpread')
    expect(result).toEqual(20)
  })
})


describe('setSettings', () => {
  beforeEach(() => {
    settingsModel.find = jest.fn()
    settingsModel.findOneAndUpdate = jest.fn()
  })

  it('If empty object, just returns default settings', async () => {
    (settingsModel.find as unknown as jest.Mock).mockReturnValue([])
    const newSettings = await setSettings({})
    expect(newSettings).toEqual(defaultSettings)
    expect(settingsModel.findOneAndUpdate).not.toHaveBeenCalled()
  })

  it('Updates for each setting updated', async () => {
    (settingsModel.find as unknown as jest.Mock).mockReturnValue([])
    const newSettings = await setSettings({
      ironCondorsEnabled: false,
      ironCondorSymbols: [ 'SPY', 'IWM' ],
      maximumPricePerSpread: 0.50
    })
    expect(newSettings).toEqual(defaultSettings)
    expect(settingsModel.findOneAndUpdate).toHaveBeenCalledTimes(3)

    expect(settingsModel.findOneAndUpdate).toHaveBeenCalledWith(
      { key: 'ironCondorsEnabled' },
      { key: 'ironCondorsEnabled', value: false },
      { upsert: true }
    )
    expect(settingsModel.findOneAndUpdate).toHaveBeenCalledWith(
      { key: 'ironCondorSymbols' },
      { key: 'ironCondorSymbols', value: [ 'SPY', 'IWM' ] },
      { upsert: true }
    )
    expect(settingsModel.findOneAndUpdate).toHaveBeenCalledWith(
      { key: 'maximumPricePerSpread' },
      { key: 'maximumPricePerSpread', value: 0.50 },
      { upsert: true }
    )
  })
})