import { Routes, Route } from 'react-router-dom'
import Showcase from './controllers/Showcase'

const App = () => {
  return (
    <Routes>
      <Route path='/' element={<Showcase />} />
    </Routes>
  )
}

export default App
