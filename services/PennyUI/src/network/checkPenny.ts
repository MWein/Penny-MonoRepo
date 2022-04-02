import getPennyDataUrl from "./getPennyDataUrl"
const superagent = require('superagent')

const fetchPennyStatus = async (
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

export default fetchPennyStatus