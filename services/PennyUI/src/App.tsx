import { Routes, Route, useSearchParams } from 'react-router-dom'
import Showcase from './controllers/Showcase'
import EnvironmentRibbon from './components/EnvironmentRibbon'

const App = () => {
  const [ searchParams, setSearchParams ] = useSearchParams()
  const env = searchParams.get('env')

  const isNonProd = env?.toLowerCase() === 'nonprod'


  return (
    <>
      {isNonProd && <EnvironmentRibbon />}
      <Routes>
        <Route path='/' element={<Showcase />} />
      </Routes>
    </>
  )
}

export default App
