const NONPROD_PORT = 3001
const PROD_PORT = 3002

const getPennyDataUrl = () => {
  const location = window.location

  const isNonProd = location.search.toLowerCase().includes('nonprod')
  const portNumber = isNonProd ? NONPROD_PORT : PROD_PORT

  return `http://${location.hostname}:${portNumber}`
}

export default getPennyDataUrl