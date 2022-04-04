import { settingsModel } from '@penny/db-models'

type Settings = {
  ironCondorsEnabled?: boolean,
  ironCondorSymbols?: string[],
  maximumPricePerSpread?: number,
}

export const defaultSettings: Settings = {
  ironCondorsEnabled: true,
  ironCondorSymbols: [],
  maximumPricePerSpread: 0.20
}

export const getSettings = async () : Promise<Settings> => {
  try {
    const mongoSettings = await settingsModel.find()

    // Replace default settings if needed
    const settings = mongoSettings.reduce((acc, setting) => (
      {
        ...acc,
        [setting.key]: setting.value
      }
    ), defaultSettings)
  
    return settings
  } catch (e) {
    return defaultSettings
  }
}


export const getSetting = async (key: string) : Promise<any> => {
  try {
    const mongoSetting = await settingsModel.findOne({ key })
    return mongoSetting === null ? defaultSettings[key] : mongoSetting.value
  } catch (e) {
    return defaultSettings[key]
  }
}


export const setSettings = async (changes: Settings) : Promise<Settings> => {
  await Promise.all(Object.keys(changes).map(async key => {
    const value = changes[key]
    await settingsModel.findOneAndUpdate({ key }, { key, value }, { upsert: true })
  }))

  const newSettings = await getSettings()

  return newSettings
}