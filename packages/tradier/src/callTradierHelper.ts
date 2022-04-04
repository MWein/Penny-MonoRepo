import * as network from './network'

// This is to address that stupid array thing that Tradier does
// If theres a single object, it returns it as an object
// If theres multiple, it returns an array
// Really fricken annoying
export const callTradierHelper = async (
  url: string,
  firstKey: string,
  secondKey: string | null,
  asArray: boolean,
) => {
  const response = await network.get(url)
  if (response[firstKey] === 'null') {
    return asArray ? [] : null
  }

  let targetResponseObject = response[firstKey]
  if (secondKey) {
    targetResponseObject = targetResponseObject[secondKey]
  }

  if (!asArray) {
    return targetResponseObject
  }

  if (Array.isArray(targetResponseObject)) {
    return targetResponseObject
  } else {
    return [ targetResponseObject ]
  }
}