import './App.css'
import Hero from './assets/components/home/child/Hero'
import Navbar from './assets/components/home/child/Navbar'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './assets/pages/LoginPage'
import Register from './assets/pages/RegisterPage'
import Listings from './assets/components/home/child/Listings'
import Quote from './assets/components/home/child/Quote'
import Footer from './assets/components/global/Footer'
import Terms from './assets/pages/TermsPage'
import HomePage from './assets/pages/HomePage'
import Pricing from './assets/pages/PricingPage'
import ListingPage from './assets/pages/ListingPage'
import ProtectedRoute from './assets/components/global/ProtectedRoute'
import JobPage from './assets/pages/JobPage'
import PricingPage from './assets/pages/PricingPage'

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
          <Route path="/pricing" element={<ProtectedRoute><PricingPage/></ProtectedRoute>}/>
          <Route path="/login" element={<LoginPage/>}/>
          <Route path="/register" element={<RegisterPage/>}/>
          <Route path="/legal/terms" element={<TermsPage/>}/>
          <Route path="/listings" element={<ListingPage/>}/>
          <Route path="/listings/:id" element={<ProtectedRoute><JobPage/></ProtectedRoute>} />
        </Routes>
      </Router>

    </div>
    )
}



export default App
