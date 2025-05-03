import { FormEvent, useEffect, useState } from 'react';
import '/src/assets/style/navbar.css';
import SidePanel from '../../global/SidePanel';
import Dropdown from '../../global/Dropdown';
import { Link, redirect, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { useNotifications } from '../../../hooks/useNotifications';
import { useIsFreelancer } from '../../../hooks/useIsFreelancer';
import api from '../../../../AxiosInstance';
import { Quote } from '../../../models/Quote';
import { Notification } from '../../../models/Notification';

interface NavbarProps {
    active: string;
}

interface QuoteProps {
    quote: Quote;
}

interface NotificationProps {
    note: Notification;
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
    const {isFreelancer} = useIsFreelancer();

    const [target, setTarget] = useState<string>('');

    function searchUser(e: FormEvent) {
        if(target === user.username) return navigate("/account/information");
        return navigate("/profile/"+target);
    }

    function AddQuoteFunctions({ note }: NotificationProps) {
        const handleQuoteAction = () => {
    
            if (note?.quote?.quoteState === 2) {
                handleCancelQuote({ note: note });
            } else {
                handleDeclineQuote({ note: note });
            }
        };
    
        return (
            <>
                <Link to="#" className="btn btn-primary" onClick={() => handleAcceptQuote({ note: note })}>
                    Accept
                </Link>
                <Link to="#" className="btn btn-danger" onClick={handleQuoteAction}>
                    {note?.quote?.quoteState === 2 ? "Cancel" : "Decline"}
                </Link>
            </>
        );
    }
    

    const handleLogout = async () => {
        await logout(); 
        navigate("/login");
    };

    const handleAcceptQuote = async ({ note }: NotificationProps) => {
        try {
            await api.post(`/quotes/accept/${note.quote.id}`);
            alert(`You have successfully accepted the quote of ${note.freelancerUsername} for $${note.quote.price}`);
        } catch (error) {
            alert(error.response.data);
            console.log(error || "An error occurred while accepting your quote.");
        }
    };

    const handleDeclineQuote = async ({note}: NotificationProps) => {
        
        try {
            await api.post(`/quotes/decline/${note.quote.id}`);
            alert("You have successfully denied the quote of " + note.freelancerUsername + " for " + note.quote.price);
        } catch(error) {
            if(error.response) alert(error.response.data || "An error occurred while denying your quote.");
            console.log(error || "An error occurred while denying your quote.");
        }
    }

    const handleCancelQuote = async ({note}: NotificationProps) =>  {
        try {
            await api.post(`/quotes/cancel/${note.quote.id}`);
            alert("You have successfully canceled the quote of " + note.freelancerUsername + " for $" + note.quote.price +
                " for the job ID: " + note.quote.jobId
            );
        } catch(error) {
            if(error.response) alert(error.response.data || "An error occurred while canceling your quote.");
            console.log(error || "An error occurred while canceling your quote.");
        }
    }

    
    const actions = [
        <div className="info">
            <img src={`/src/assets/images/${user?.imageUrl}`} alt="Avatar"/>
            <h4>{user?.username}</h4>
            <div className="horizontal-spacer"/>
        </div>
        ,
        <Link to="/account"><span className="material-symbols-outlined">person</span>My Profile</Link>,
        <Link to=""><span className="material-symbols-outlined">settings</span>Settings</Link>,
        <Link to=""><span className="material-symbols-outlined">payments</span>Billing</Link>,
        <div className="horizontal-spacer"/>,
        <Link to="" className="btn btn-danger" onClick={handleLogout}><span className="material-symbols-outlined">logout</span>Sign Out</Link>
    ]



    const notificationsActions = notifications.map((note)=> (
        <div key={note.id} className={`notification dropdown-item ${note.isRead ? "mark" : ""}`}>
            <p className="message">{note.message}</p>
            <div className="notification-time">{formatDate(note.createdAt)}</div>
            <form onSubmit={(e)=> {
                e.preventDefault();
                e.stopPropagation();
                if(note.isRead) return;
                markAsRead(note.id);
    
            }}>
                <div className="notification-buttons">
                <button type="submit" className={`btn ${note.isRead ? "mark btn-gray" : "btn-alert"}`}>Read</button>
                {note.quote && <AddQuoteFunctions note={note}/>}
                </div>

            </form>
        </div>
    ));

    if(notificationsActions.length === 0) notificationsActions.push(<a id="no-notifications">No notifications yet.</a>);

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
            <div className="account-details">
                <div className="notification-menu">
                <Dropdown main={<img src="/src/assets/images/notification.svg" className="notifications" alt="Notification"/>}
                actions={notificationsActions}/>
                </div>

                <Dropdown main={<img src={`/src/assets/images/${user?.imageUrl}`} alt="Avatar"/>}
                actions={actions}/>
                
            </div>
            {!isFreelancer && <Link to="/freelancing" className="text-tertiary nav-link">Become a Freelancer</Link>}
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
 
                <form className="mobile-search-form" onSubmit={searchUser}>
                <div className="input-group">
                    <label htmlFor="input_search">
                        <img src="/src/assets/images/search.svg"/>
                        <input type="text" name="input_search" id="input_search" placeholder="Search User" value={target} onChange={(e)=>setTarget(e.target.value)}/></label>

                </div>
                <button type="submit" className="btn btn-primary">Search</button>
            </form>

                {!isFreelancer && <Link to="/freelancing" className="text-tertiary nav-link">Become a Freelancer</Link>}
                </li>
                
                </ul>
            </SidePanel>
            
            
            {!isPanelOpen && <NavLinks/>}

            {!isPanelOpen && <form className="search_nav" method="get" onSubmit={searchUser}>
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