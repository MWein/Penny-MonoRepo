import { Routes, Route, useSearchParams } from 'react-router-dom'
//import ShowcaseControllerRNS from './controllers/ShowcaseControllerRNS'
import ShowcaseController from './controllers/ShowcaseController'
import EnvironmentRibbon from './components/EnvironmentRibbon'

const App = () => {
  const [ searchParams ] = useSearchParams()
  const env = searchParams.get('env')
  const isNonProd = env?.toLowerCase() === 'nonprod'

  return (
    <>
      {isNonProd && <EnvironmentRibbon />}
      <Routes>
        <Route path='/' element={<ShowcaseController />} />
      </Routes>
    </>
  )
}

export default App
