import { FormEvent, useState } from 'react';
import '/src/assets/style/hero.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';

function Hero() {

    const {user, authChecked} = useAuth();
    const [target, setTarget] = useState<string>('');
    const navigate = useNavigate();

    if(!authChecked) return <div className="loader-overlay"><div className='loader'/></div>

    function searchUser(e: FormEvent) {
        if(user && target === user?.username) return navigate("/account/information");
        return navigate("/profile/"+target);
    }

    return (
        <div className="hero">
            <div className="hero-content">
                <img className="hero-img" src="/src/assets/images/hero.avif"/>
                <div className="hero-text">
                    <p>We connect clients with the <span>best</span> freelancers remotely</p>
                    
                    <div className="hero-btns">
                        <a href="/quote" className="btn btn-primary rounded">Post a listing</a>
                        <a href="/freelancing" className="btn btn-secondary rounded">Become a freelancer</a>
                    </div>
                    <div className="search">
            

                        <form className="" method="get" onSubmit={searchUser}>
                        <div className="input-group search_element">
                            <label htmlFor="input_search">
                                <img src="/src/assets/images/search.svg"/>
                                <input type="text" name="input_search" id="input_search" placeholder="Search User" value={target} onChange={(e)=>setTarget(e.target.value)} required/></label>
                               
                            <button type="submit" className="btn btn-secondary">Search</button>
                        </div>
                      
                        
                    </form>
                    <p><strong>Popular:</strong> UI Design <span>+</span> Software Engineer <span>+</span> Web Developer</p>
                    </div>
                </div>
            </div>
        </div>
    );
    
}

export default Hero