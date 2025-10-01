import React from 'react';
import {BrowserRouter , Route,Routes} from 'react-router-dom';
import Alarm from './pages/alarm';
function App() {
  return (
    <>
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Alarm/>}></Route>
      </Routes>
      </BrowserRouter>
        
    </>
  )
}

export default App
