import React , {useContext} from 'react'
import { Routes , Route , Navigate} from 'react-router-dom'
import Home from './pages/Home.jsx'
import Signup from './pages/Signup.jsx'
import Signin from './pages/signin.jsx'
import Network from './pages/Network.jsx'
import {userDataContext} from './context/UserContext.jsx'

function App() {
  let {userData} = useContext(userDataContext);
  return (
    <Routes>
      <Route path="/" element={userData?<Home />:<Navigate to="/signin" />} />
      <Route path="/signup" element={userData?<Navigate to="/"/>:<Signup />} />
      <Route path="/signin" element={userData?<Navigate to="/"/>:<Signin />} />
      <Route path="/network" element={userData?<Network />:<Navigate to="/signin" />} />
    </Routes>
  )
}

export default App
