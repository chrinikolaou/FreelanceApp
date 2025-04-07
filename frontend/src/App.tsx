import './App.css'
import Hero from './assets/components/home/Hero'
import Navbar from './assets/components/home/Navbar'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './assets/pages/Login'
import Register from './assets/pages/Register'
import Listings from './assets/components/home/Listings'
import Quote from './assets/components/home/Quote'
import Footer from './assets/components/home/Footer'
import Terms from './assets/pages/Terms'

function App() {

  const HomePage = () => {
    return (
    <>
      <Navbar/>
      <Hero/>
      <Listings/>
      <Quote/>
      <Footer/>
    </>
    );
  }

  const LoginPage = () => {
    return (
      <>
            <Navbar/>
            <Login/>
            <Footer/>
      </>
    );
  }

  const RegisterPage = () => {
    return (
      <>
        <Navbar/>
        <Register/>
        <Footer/>
      </>
    )
  }

  const TermsPage = () => {
    return (
      <>
        <Navbar/>
        <Terms/>
        <Footer/>
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
          <Route path="/legal/terms" element={<TermsPage/>}/>
        </Routes>
      </Router>

    </div>
    )
}



export default App
