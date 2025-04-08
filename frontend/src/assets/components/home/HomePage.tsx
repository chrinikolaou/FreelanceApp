import Footer from "../global/Footer";
import Hero from "./child/Hero";
import Listings from "./child/Listings";
import Navbar from "./child/Navbar";
import Quote from "./child/Quote";
import StartAction from "./child/StartAction";

function HomePage() {

    return (
        <>
            <Navbar active="home"/>
            <Hero/>
            <Listings/>
            <Quote/>
            <StartAction/>
            <Footer/>
        </>
    );

}

export default HomePage;