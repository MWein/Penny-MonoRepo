const superagent = require('superagent')


export const get = async (url: string, isNonProd: boolean) => {
  const response = await superagent.get(url)
    .set('Accept', 'application/json')
    .timeout({
      response: 5000
    })
    .retry(5)

  return response.body
}