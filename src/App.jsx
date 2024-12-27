import { useState } from 'react'
import SettingsPage from './components/SettingsPage';
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
          {<SettingsPage />}
      </div>
    </>
  )
}

export default App
