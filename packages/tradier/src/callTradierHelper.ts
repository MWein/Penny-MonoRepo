import * as network from './network'

// This is to address that stupid array thing that Tradier does
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