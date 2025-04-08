import '/src/assets/style/hero.css';

function Hero() {

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
               
                        <form className="" method="post" action="">
                        <div className="input-group search_element">
                            <label htmlFor="input_search">
                                <img src="/src/assets/images/search.svg"/>
                                <input type="text" name="input_search" id="input_search" placeholder="Search" required/>
                            </label>
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