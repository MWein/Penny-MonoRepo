import { settingsModel } from '@penny/db-models'

type Settings = {
  callsEnabled?: boolean,
  putsEnabled?: boolean,
  closeExpiringPuts?: boolean,
  allocateUnutilizedCash?: boolean,
  defaultVolatility?: number,
  reserve?: number,
  profitTarget?: number,
  priorityList?: Array<string>,
}

export const defaultSettings: Settings = {
  callsEnabled: true,
  putsEnabled: true,
  closeExpiringPuts: false,
  allocateUnutilizedCash: false,
  defaultVolatility: 0.05, // A safety buffer to be used with stocks when calculating unutilized funds
  reserve: 0, // Money that Penny shouldn't touch. BuyingPower - Reserve. For planned withdrawals.
  profitTarget: 0.75, // Profit to set Buy-To-Close orders to
  priorityList: [],
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