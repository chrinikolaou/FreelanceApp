import './App.css'
import Hero from './assets/components/home/child/Hero'
import Navbar from './assets/components/home/child/Navbar'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './assets/pages/Login'
import Register from './assets/pages/Register'
import Listings from './assets/components/home/child/Listings'
import Quote from './assets/components/home/child/Quote'
import Footer from './assets/components/global/Footer'
import Terms from './assets/pages/Terms'
import HomePage from './assets/components/home/HomePage'
import Pricing from './assets/pages/Pricing'
import ListingPage from './assets/components/home/ListingPage'

function App() {

  const LoginPage = () => {
    return (
      <>
            <Navbar active=""/>
            <Login/>
            <Footer/>
      </>
    );
  }

  const RegisterPage = () => {
    return (
      <>
        <Navbar active=""/>
        <Register/>
        <Footer/>
      </>
    )
  }

  const TermsPage = () => {
    return (
      <>
        <Navbar active=""/>
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
          <Route path="/pricing" element={<Pricing/>}/>
          <Route path="/user/login" element={<LoginPage/>}/>
          <Route path="/user/register" element={<RegisterPage/>}/>
          <Route path="/legal/terms" element={<TermsPage/>}/>
          <Route path="/listings" element={<ListingPage/>}/>
        </Routes>
      </Router>

    </div>
    )
}



export default App
