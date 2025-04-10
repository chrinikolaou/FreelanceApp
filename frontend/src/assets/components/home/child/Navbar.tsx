import { useEffect, useState } from 'react';
import '/src/assets/style/navbar.css';
import SidePanel from '../../lib/SidePanel';


interface NavbarProps {
    active: string;
}

function Navbar({active = "home"}: NavbarProps) {

    const [isPanelOpen, setPanelOpen] = useState(false);
    const [isWideScreen, setIsWideScreen] = useState(false);

    useEffect(() => {
        const handleResize = () => {
          if (window.innerWidth > 1000 && isPanelOpen) {
            setPanelOpen(false); 
          }
          setIsWideScreen(window.innerWidth > 1000);
        };
    
        window.addEventListener('resize', handleResize);
    
        return () => {
          window.removeEventListener('resize', handleResize);
        };
      }, [isPanelOpen]); 

    useEffect(() => {

        const inputGroup = document.querySelector(".search_div");
        const searchIcon = inputGroup?.querySelector("img");

        if (!inputGroup || !searchIcon) return;

        const toggleSearch = () => {
            inputGroup.classList.toggle("expanded");
        };

        const closeSearch = (event: MouseEvent) => {
            if (!inputGroup.contains(event.target as Node)) {
                inputGroup.classList.remove("expanded");
            }
        };

        searchIcon.addEventListener("click", toggleSearch);
        document.addEventListener("click", closeSearch);

        return () => {
            searchIcon.removeEventListener("click", toggleSearch);
            document.removeEventListener("click", closeSearch);
        };
    }, []);

    const NavElements = () => {
        return (
        <>
            <div className="nav-links">
                <a className={`nav-link ${active === "home" ? "active" : ""}`} href="/">Home</a>
                <a className={`nav-link ${active === "listings" ? "active" : ""}`} href="/listings">View Listings</a>
                <a className={`nav-link ${active === "quote" ? "active" : ""}`}>Get a Quote</a>
                <a className={`nav-link ${active === "pricing" ? "active" : ""}`} href="/pricing">Pricing</a>
        </div>
            <div className="nav-buttons">
            <form className="" method="post" action="">
                <div className="input-group search_div">
                    <label htmlFor="input_search">
                        <img src="/src/assets/images/search.svg"/>
                        <input type="text" name="input_search" id="input_search" placeholder="Search"/></label>
                
                </div>
            </form>
            <a className="btn btn-primary" href="/user/login">Sign In</a>
            <a className="btn btn-secondary" href="/user/register">Register</a>
            <a className="text-tertiary nav-link" href="#">Become a Seller</a>
            </div>
        </>
        );
    };

    return (

        <nav className="navigation">
            <h1><a href="/">VFreelance</a></h1>
            <SidePanel className="mobile-sidepanel" isOpen={isPanelOpen} hasCloseButton={false} onClose={() => setPanelOpen(false)}>
                <ul className="sidepanel-nav">
                    
                <li>
                    <a className={`nav-link ${active === "home" ? "active" : ""}`} href="/">Home</a>
                </li>
                <li>
                    <a className={`nav-link ${active === "listings" ? "active" : ""}`} href="/listings">View Listings</a>
                </li>
                <li>
                    <a className={`nav-link ${active === "quote" ? "active" : ""}`}>Get a Quote</a>
                </li>
                <li>
                    <a className={`nav-link ${active === "pricing" ? "active" : ""}`} href="/pricing">Pricing</a>
                </li>
                <li className="mobile-buttons">
 
                <a className="text-tertiary nav-link" href="/user/login">Login</a>
                <a className="text-tertiary nav-link" href="/user/register">Register</a>
                <a className="btn btn-secondary">Become a Seller</a>
                <form className="mobile-search-form" method="post" action="">
                <div className="input-group">
                    <label htmlFor="input_search">
                        <img src="/src/assets/images/search.svg"/>
                        <input type="text" name="input_search" id="input_search" placeholder="Search"/></label>

                </div>
                <button type="submit" className="btn btn-primary">Search</button>
            </form>
                </li>
                
                </ul>
            </SidePanel>
            
            
            {!isPanelOpen && <NavElements/>}
          {!isWideScreen && <img className="nav-menu-button" src={isPanelOpen ? "/src/assets/images/close.svg" : "/src/assets/images/menu.svg"} onClick={()=>setPanelOpen(!isPanelOpen)}/>}
        </nav>


    )

}

export default Navbar