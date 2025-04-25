import { useEffect, useState } from 'react';
import '/src/assets/style/navbar.css';
import SidePanel from '../../global/SidePanel';
import Dropdown from '../../global/Dropdown';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { useNotifications } from '../../../hooks/useNotifications';


interface NavbarProps {
    active: string;
}

function formatDate(dateString: string) : string {
    const date = new Date(dateString);

    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric'
    });
}

function Navbar({active = "home"}: NavbarProps) {

    const [isPanelOpen, setPanelOpen] = useState(false);
    const [isWideScreen, setIsWideScreen] = useState(false);
    const {user, logout} = useAuth();
    const { notifications, loading, error, markAsRead} = useNotifications(user?.id || null);
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout(); 
        navigate("/login");
    };

    const actions = [
        <div className="info">
            <img src={`/src/assets/images/${user?.imageUrl}`} alt="Avatar"/>
            <h4>{user?.username}</h4>
            <div className="horizontal-spacer"/>
        </div>
        ,
        <Link to=""><span className="material-symbols-outlined">person</span>My Profile</Link>,
        <Link to=""><span className="material-symbols-outlined">settings</span>Settings</Link>,
        <Link to=""><span className="material-symbols-outlined">payments</span>Billing</Link>,
        <div className="horizontal-spacer"/>,
        <Link to="" className="btn btn-danger" onClick={handleLogout}><span className="material-symbols-outlined">logout</span>Sign Out</Link>
    ]

    const notificationsActions = notifications.map((note)=> (
        <div key={note.id} className={`notification dropdown-item ${note.isRead ? "mark" : ""}`}>
            <a>{note.message}</a>
            <div className="notification-time">{formatDate(note.createdAt)}</div>
            <form onSubmit={(e)=> {
                e.preventDefault();
                e.stopPropagation();
                if(note.isRead) return;
                markAsRead(note.id);
            }}>
                <button type="submit" className={`btn ${note.isRead ? "mark btn-gray" : "btn-primary"}`}>Read</button>
            </form>
        </div>
    ));

    if(notificationsActions.length === 0) notificationsActions.push(<a id="no-notifications">No notifications yet.</a>);

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
            <div className="account-details">
                <div className="notification-menu">
                <Dropdown main={<img src="/src/assets/images/notification.svg" className="notifications" alt="Notification"/>}
                actions={notificationsActions}/>
                </div>

                <Dropdown main={<img src={`/src/assets/images/${user?.imageUrl}`} alt="Avatar"/>}
                actions={actions}/>
                
            </div>
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
 
                

                <a className="btn btn-secondary">Become a Seller</a>
                </li>
                
                </ul>
            </SidePanel>
            
            
            {!isPanelOpen && <NavElements/>}
          {!isWideScreen && <img className="nav-menu-button" src={isPanelOpen ? "/src/assets/images/close.svg" : "/src/assets/images/menu.svg"} onClick={()=>setPanelOpen(!isPanelOpen)}/>}
        </nav>


    )

}

export default Navbar