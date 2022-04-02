const superagent = require('superagent')

// TODO CHANGE URL
const fetchPennyStatus = async (
  setLoadingCallback: Function,
  setStatusCallback: Function,
) => {
  setLoadingCallback(true)
  const result = await superagent.get(`http://localhost:3001/penny-status`).timeout({
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