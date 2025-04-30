import { FormEvent, useState } from 'react';
import '/src/assets/style/hero.css';
import { useNavigate } from 'react-router-dom';

function Hero() {


    const [target, setTarget] = useState<string>('');
    const navigate = useNavigate();

    function searchUser(e: FormEvent) {
        e.preventDefault();
        return navigate("/profile/"+target);
    }

    return (
        <div className="hero">
            <div className="hero-content">
                <img className="hero-img" src="/src/assets/images/hero.avif"/>
                <div className="hero-text">
                    <p>We connect clients with the <span>best</span> freelancers remotely</p>
                    
                    <div className="hero-btns">
                        <a href="" className="btn btn-primary rounded">Post a listing</a>
                        <a href="" className="btn btn-secondary rounded">Become a freelancer</a>
                    </div>
                    <div className="search">
            

                        <form className="" method="post" onSubmit={searchUser}>
                        <div className="input-group search_element">
                            <label htmlFor="input_search">
                                <img src="/src/assets/images/search.svg"/>
                                <input type="text" name="input_search" id="input_search" placeholder="Search User" value={target} onChange={(e)=>setTarget(e.target.value)}/></label>
                               
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