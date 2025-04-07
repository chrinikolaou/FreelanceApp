import '../style/listings.css';

function Listings() {

    return (
        <div className="listings-container">
            <div className="text">
                <h2>Latest Listings</h2>
                <a href="" className="nav-link text-tertiary active">View all</a>
            </div>
            <div className="listings">

                <div className="card">
                    <div className="card-details">
                    <img src="/src/assets/images/avatar_man_1.svg"/>
                    <p>21/03/2025 - 21:36 PM</p>
                    </div>
                    
                    <p>I need a web application with react framework and spring boot as backend 
                        that is going to be a ticket system.. 
                    </p>
                    <div className="card-buttons">
                    <a href="#"className="text-link">Learn More...</a>
                        </div>
                </div>

                <div className="card">
                    <div className="card-details">
                    <img src="/src/assets/images/avatar_man_2.svg"/>
                    <p>22/03/2025 - 22:00 PM</p>
                    </div>
                    
                    <p>I need a fully functional minecraft practice core coded from scratch with the source included. My budget
                        is N/A.
                    </p>
                    <div className="card-buttons">
                    <a href="#"className="text-link">Learn More...</a>
                        </div>
                </div>

                <div className="card">
                    <div className="card-details">
                    <img src="/src/assets/images/avatar_man_2.svg"/>
                    <p>22/03/2025 - 22:00 PM</p>
                    </div>
                    
                    <p>I need a fully functional minecraft practice core coded from scratch with the source included. My budget
                        is N/A.
                    </p>
                    <div className="card-buttons">
                    <a href="#"className="text-link">Learn More...</a>
                        </div>
                </div>

                <div className="card">
                    <div className="card-details">
                    <img src="/src/assets/images/avatar_man_2.svg"/>
                    <p>22/03/2025 - 22:00 PM</p>
                    </div>
                    
                    <p>I need a fully functional minecraft practice core coded from scratch with the source included. My budget
                        is N/A.
                    </p>
                    <div className="card-buttons">
                    <a href="#"className="text-link">Learn More...</a>
                        </div>
                </div>


            </div>
        </div>
    );


}

export default Listings