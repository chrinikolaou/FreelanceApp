import './App.css'
import Hero from './assets/components/Hero'
import Navbar from './assets/components/Navbar'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './assets/pages/Login'
import Register from './assets/pages/Register'
import Listings from './assets/components/Listings'
import Quote from './assets/components/Quote'

function App() {

  const HomePage = () => {
    return (
    <>
      <Navbar/>
      <Hero/>
      <Listings/>
      <Quote/>
    </>
    );
  }

  const LoginPage = () => {
    return (
      <>
            <Navbar/>
            <Login/>
      </>
    );
  }

  const RegisterPage = () => {
    return (
      <>
        <Navbar/>
        <Register/>
      </>
    )
  }

  return (
    <div className="content">
      <Router>
        <Routes>
          <Route path="/" element={<HomePage/>}/>
          <Route path="/user/login" element={<LoginPage/>}/>
          <Route path="/user/register" element={<RegisterPage/>}/>
        </Routes>
      </Router>

    </div>
    )
}



export default App
