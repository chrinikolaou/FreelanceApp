import { useAuth } from "../hooks/useAuth";
import { useJobs } from "../hooks/useJobs";
import Footer from "../components/global/Footer";
import Navbar from "../components/home/child/Navbar";
import SignedNavbar from "../components/home/child/SignedNavbar";
import '/src/assets/style/pages/jobs.css';
import { Link } from "react-router-dom";


function formatDate(dateString: string) : string {
    const date = new Date(dateString);

    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}

function ListingPage() {

    const { user } = useAuth(); 
    const {jobs, loading} = useJobs();


    if(loading) {
        return <div className="loader-overlay"><div className="loader"/></div>
    }



    return(
        <>
            {user ? <SignedNavbar active="listings"/> : <Navbar active="listings"/>}
            <div className="jobs-container">
                <h1>All Jobs Posted</h1>
                <p>Click the <a className="text-link" href="#">Learn More</a> button in a job listing to learn more information about it.</p>
                
                {jobs.length == 0 && <p className="empty-jobs"><b>No available jobs at the moment.</b></p>}
                <div className="jobs">
                {jobs.filter(job=>job.state === "Open").map(job => (
                    
                    <div className="card">
                    <div className="card-details">
                    <img src="/src/assets/images/avatar_man_1.svg"/>
                    
                    <div className="job-heading">
                        <p>ID: {job.id}</p>
                        <p>Created: {formatDate(job.createdAt)}</p>
                        <p>Deadline: {formatDate(job.deadline)}</p>
                   
                    </div>
            
                    </div>
                

                    <p>{job.description}</p>
      
                    <div className="card-buttons">
                    <Link to={`/listings/${job.id}`} className="text-link">Learn More...</Link>
                        </div>
                    </div>
                ))}
                </div>
            
            </div>
            <Footer/>
        </>
    );
}

export default ListingPage;