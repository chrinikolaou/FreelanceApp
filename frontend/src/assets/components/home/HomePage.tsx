import { useAuth } from "../../hooks/useAuth"; // Import the useAuth hook
import Footer from "../global/Footer";
import Hero from "./child/Hero";
import Listings from "./child/Listings";
import Navbar from "./child/Navbar";
import Quote from "./child/Quote";
import SignedNavbar from "./child/SignedNavbar";
import StartAction from "./child/StartAction";

function HomePage() {
    const { user, authChecked } = useAuth(); // Get user and auth status from useAuth

    // Show a loading state while the authentication status is being checked
    if (!authChecked) {
        return <div>Loading...</div>; // You can replace this with a loader component
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
