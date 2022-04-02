import { Routes, Route, useSearchParams } from 'react-router-dom'
import Showcase from './controllers/ShowcaseController'
import EnvironmentRibbon from './components/EnvironmentRibbon'

const App = () => {
  const [ searchParams ] = useSearchParams()
  const env = searchParams.get('env')
  const isNonProd = env?.toLowerCase() === 'nonprod'


  return (
    <>
      {isNonProd && <EnvironmentRibbon />}
      <Routes>
        <Route path='/' element={<Showcase isNonProd={isNonProd} />} />
      </Routes>
    </>
  )
}

export default App
