import Footer from "../global/Footer";
import Navbar from "./child/Navbar";
import '/src/assets/style/pages/jobs.css';
import axios from 'axios';


function ListingPage() {

    return(
        <>
            <Navbar active="listings"/>
            <div className="jobs-container">
                <h1>All Jobs Posted</h1>
                <p>Click the <a className="text-link" href="#">Learn More</a> button in a job listing to learn more information about it.</p>
                {/* Retrieve backend values  */}
                
                <div className="job">
                    <div className="title">
                        <h2>UI/UX Designer</h2>
                    </div>
                    <div className="content">

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
                </div>
                </div>

                <div className="job">
                    <div className="title">
                        <h2>Minecraft Plugin Developer</h2>
                    </div>
                    <div className="content">

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


            </div>
            <Footer/>
        </>
    );
}

export default ListingPage;