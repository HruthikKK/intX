import React from 'react'
import { BrowserRouter, Router, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import Dashboard from './pages/Dashboard'
import Header from './components/Header'
import Profile from './pages/Profile'
import Blog from './pages/Blog'

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path='/' element={<Home />}/>
        <Route path='/signin' element={<SignIn />}/>
        <Route path='/signup' element={<SignUp />}/>
        <Route path='/profile' element={<Profile />}/>
        <Route path='/blog/:id' element={<Blog />}/>
        <Route path='/dashboard' element={<Dashboard />}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
