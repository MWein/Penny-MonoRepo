import getPennyDataUrl from "./getPennyDataUrl"
const superagent = require('superagent')

export const fetchPennyStatus = async (
  setLoadingCallback: Function,
  setStatusCallback: Function,
) => {
  const basePath = getPennyDataUrl()

  setLoadingCallback(true)
  const result = await superagent.get(`${basePath}/penny-status`).timeout({
    deadline: 5000
  }).retry(5).catch(() => {
    setLoadingCallback(false)
    setStatusCallback(false)
  })

  if (result) {
    setLoadingCallback(false)
    setStatusCallback(result.body.healthy)
  }
}

export const fetchPennyCronTimes = async (
  setLoadingCallback: Function,
  setCronsCallback: Function,
) => {
  const basePath = getPennyDataUrl()

  setLoadingCallback(true)
  const result = await superagent.get(`${basePath}/cron-times`).timeout({
    deadline: 5000
  }).retry(5).catch(() => {
    setLoadingCallback(false)
    setCronsCallback([])
  })

  if (result) {
    setLoadingCallback(false)
    setCronsCallback(result.body)
  }
}