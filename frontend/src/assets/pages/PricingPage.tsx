import Footer from "../components/global/Footer";
import Navbar from "../components/home/child/Navbar";
import SignedNavbar from "../components/home/child/SignedNavbar";
import { useAuth } from "../hooks/useAuth";
import '/src/assets/style/pages/pricing.css';

function Pricing() {

    const { user } = useAuth(); 

    return (
        <>
        {user ? <SignedNavbar active="listings"/> : <Navbar active="listings"/>}
        <div className="pricing-container">
            <div className="text">
            <h1>Pricing Packages</h1>
            <p>Pricing that suits every need.</p>
            </div>
            <div className="containers">
            <div className="card">
               
               <div className="card-info">

                    {Array.from({length:1}).map(()=>(
                        <span className="star material-symbols-outlined">star</span>
                    ))}
             
                    <h2>FREE</h2>
                </div>
                    <ul>
                        <li>No upfront costs or charges</li>
                        <li>15% Service Fee</li> 
                        <li>Normal Support</li>
                    </ul>
                   
                    <div className="card-buttons">
                    <a href="#"className="btn btn-primary">Sign Up</a>
                    </div>
                </div>

                <div className="card">
               <div className="card-info">
              {Array.from({length:2}).map(()=>(
                   <span className="star material-symbols-outlined">star</span>
               ))}
        
              
               <h2>Essential</h2>
               </div>
               
               <ul>
                   <li><b>10$</b> per Month Subscription</li>
                   <li>5% Service Fee</li>
                   <li>Advanced Statistics</li>
                   <li>Priority Support</li>
               </ul>
              
               <div className="card-buttons">
               <a href="#"className="btn btn-primary">Sign Up</a>
               </div>
           </div>

           <div className="card">
               
               <div className="card-info">

              {Array.from({length:3}).map(()=>(
                   <span className="star material-symbols-outlined">star</span>
               ))}
    
              
               <h2>Custom</h2>
               </div>
               <p>
                Looking for something tailored to your unique needs? 

                Get in touch and let's create a solution just for you.
                </p>
             
              
               <div className="card-buttons">
               <a href="#"className="btn btn-primary">Contact</a>
               </div>
           </div>


            </div>
        </div>
        <Footer/>
        </>
        
    );

}

export default Pricing;
