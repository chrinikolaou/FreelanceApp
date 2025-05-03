import { FormEvent, useEffect, useState } from 'react';
import '/src/assets/style/navbar.css';
import SidePanel from '../../global/SidePanel';
import { redirect, useNavigate } from 'react-router-dom';


interface NavbarProps {
    active: string;
}

function Navbar({active = "home"}: NavbarProps) {


    const [isPanelOpen, setPanelOpen] = useState(false);
    const [isWideScreen, setIsWideScreen] = useState(false);

    const [target, setTarget] = useState<string>('');
    const navigate = useNavigate();

    function searchUser(e: FormEvent) {
        return navigate("/profile/"+target);
    }

    useEffect(() => {
        const handleResize = () => {
          if (window.innerWidth > 1062 && isPanelOpen) {
            setPanelOpen(false); 
          }
          setIsWideScreen(window.innerWidth > 1062);
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

    function NavLinks() {
        return (
            <>
                <div className="nav-links">
                    <a className={`nav-link ${active === "home" ? "active" : ""}`} href="/">Home</a>
                    <a className={`nav-link ${active === "listings" ? "active" : ""}`} href="/listings">View Listings</a>
                    <a className={`nav-link ${active === "quote" ? "active" : ""}`} href="/quote">Get a Quote</a>
                    <a className={`nav-link ${active === "pricing" ? "active" : ""}`} href="/pricing">Pricing</a>
            </div>
            </>
        );
    }

    function NavButtons() {

        return (
            <>
            <div className="nav-buttons">

            <a className="btn btn-primary" href="/login">Sign In</a>
            <a className="btn btn-secondary" href="/register">Register</a>
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
                    <a className={`nav-link ${active === "quote" ? "active" : ""}`} href="/quote">Get a Quote</a>
                </li>
                <li>
                    <a className={`nav-link ${active === "pricing" ? "active" : ""}`} href="/pricing">Pricing</a>
                </li>
                <li className="mobile-buttons">
 
                <a className="text-tertiary nav-link" href="/login">Login</a>
                <a className="text-tertiary nav-link" href="/register">Register</a>
                <a className="btn btn-secondary">Become a Seller</a>
                <form className="mobile-search-form" onSubmit={searchUser}>
                <div className="input-group">
                    <label htmlFor="input_search">
                        <img src="/src/assets/images/search.svg"/>
                        <input type="text" name="input_search" id="input_search" placeholder="Search User" value={target} onChange={(e)=>setTarget(e.target.value)}/></label>

                </div>
                <button type="submit" className="btn btn-primary">Search</button>
            </form>
                </li>
                
                </ul>
            </SidePanel>
            
            {!isPanelOpen && <NavLinks/>}

            {!isPanelOpen && isWideScreen && <form className="search_nav" method="get" onSubmit={searchUser}>
                <div className="input-group search_div">
                    <label htmlFor="input_search">
                        <img src="/src/assets/images/search.svg"/>
                        <input type="text" name="input_search" id="input_search" placeholder="Search User" value={target} onChange={(e)=>setTarget(e.target.value)}/></label>                
                </div>
                <button type="submit" className="btn btn-primary">Search</button>
            </form>}
           
            {!isPanelOpen && <NavButtons/>}
          {!isWideScreen && <img className="nav-menu-button" src={isPanelOpen ? "/src/assets/images/close.svg" : "/src/assets/images/menu.svg"} onClick={()=>setPanelOpen(!isPanelOpen)}/>}
        </nav>


    )

}

export default Navbar