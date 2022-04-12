const superagent = require('superagent')
import * as sleepUtil from '@penny/sleep'


// Throttle
export const wait = async (throttle: boolean): Promise<void> => {
  if (throttle) {
    const throttleTime = process.env.BASEPATH.includes('sandbox') ? 1.2 : 0.7
    await sleepUtil.sleep(throttleTime)
  }
}


// Generate form string from object
// Superagent doesn't handle this without multiple sends
export const createFormString = (body: object) : string => {
  return Object.keys(body).map(key => {
    const value = body[key]
    const formattedValue = Array.isArray(value) ? value.join(',') : value
    return `${key}=${formattedValue}`
  }).join('&')
}


export const get = async (path: string, throttle: boolean = true) => {
  await wait(throttle)

  const url = `${process.env.BASEPATH}${path}`

  const response = await superagent.get(url)
    .set('Authorization', `Bearer ${process.env.APIKEY}`)
    .set('Accept', 'application/json')
    .timeout({
      response: 5000
    })
    .retry(5)

  return response.body
}


export const post = async (path: string, body: object, throttle: boolean = true) => {
  await wait(throttle)

  const url = `${process.env.BASEPATH}${path}`
  const formString = createFormString(body)

  const response = await superagent.post(url)
    .set('Authorization', `Bearer ${process.env.APIKEY}`)
    .set('Accept', 'application/json')
    .send(formString)
    .timeout({
      response: 10000
    })

  return response.body
}


export const put = async (path: string, body: object, throttle: boolean = true) => {
  await wait(throttle)

  const url = `${process.env.BASEPATH}${path}`
  const formString = createFormString(body)

  const response = await superagent.put(url)
    .set('Authorization', `Bearer ${process.env.APIKEY}`)
    .set('Accept', 'application/json')
    .send(formString)
    .timeout({
      response: 10000
    })
    .retry(5)

  return response.body
}


export const deleteReq = async (path: string, throttle: boolean = true) => {
  await wait(throttle)

  const url = `${process.env.BASEPATH}${path}`
  const response = await superagent.delete(url)
    .set('Authorization', `Bearer ${process.env.APIKEY}`)
    .set('Accept', 'application/json')
    .timeout({
      response: 5000
    })
    .retry(5)

  return response.body
}