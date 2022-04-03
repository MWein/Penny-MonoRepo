const NodeCache = require('node-cache')
const cache = new NodeCache()


const useCache = async (
  key: string,
  func: Function,
  returnOnFailure: any,
  ttl: number = 86400 // One day,
): Promise<any> => {
  try {
    let value = cache.get(key)
    if (!value) {
      value = await func()
      cache.set(key, value, ttl)
    }
    return value
  } catch (e) {
    return returnOnFailure
  }
}

export {
  useCache
}