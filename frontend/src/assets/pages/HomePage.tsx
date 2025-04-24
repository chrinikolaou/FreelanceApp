import { useAuth } from "../hooks/useAuth"; // Import the useAuth hook
import Footer from "../components/global/Footer";
import Hero from "../components/home/child/Hero";
import Listings from "../components/home/child/Listings";
import Navbar from "../components/home/child/Navbar";
import Quote from "../components/home/child/Quote";
import SignedNavbar from "../components/home/child/SignedNavbar";
import StartAction from "../components/home/child/StartAction";

function HomePage() {
    const { user, authChecked } = useAuth(); 

    if (!authChecked) {
        return <div className="loader-overlay"><div className="loader"/></div>
    }

    return (
        <>
            {/* Conditionally render Navbar or SignedNavbar based on user authentication */}
            {user ? <SignedNavbar active="home" /> : <Navbar active="home" />}
            <Hero />
            <Listings />
            <Quote />
            <StartAction />
            <Footer />
        </>
    );
}

export default HomePage;
