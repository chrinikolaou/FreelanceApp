import { redirect, UNSAFE_ErrorResponseImpl, useNavigate, useParams } from 'react-router-dom';
import api from '../../AxiosInstance';
import { useJob } from '../hooks/useJob';
import { useAuth } from '../hooks/useAuth';
import SignedNavbar from '../components/home/child/SignedNavbar';
import Navbar from '../components/home/child/Navbar';
import '/src/assets/style/job.css';
import Footer from '../components/global/Footer';
import { RoleByOrdinal } from '../models/Role';
import { RoleMetaMap } from '../models/meta/RoleMeta';
import { MouseEventHandler, useState } from 'react';
import QuotePopup from '../components/global/QuotePopup';
import { useIsFreelancer } from '../hooks/useIsFreelancer';

function formatDate(dateString: string) : string {
    const date = new Date(dateString);

    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}

function JobPage() {

    const { id } = useParams<{ id: string}>();
    const {job, loading, error} = useJob(id);
    const {user} = useAuth();
    const role = RoleByOrdinal[job?.category as number];
    const meta = RoleMetaMap[role];
    const [isQuotePopupOpen, setQuotePopupOpen] = useState(false); 
    const {isFreelancer} = useIsFreelancer();
    const navigate = useNavigate();

    const handleDeletion = async (e: any) => {
        e.preventDefault();

        if(!job) return;

        try {
            await api.delete(`/jobs/${job?.id}/delete`);
            alert("Your job has been deleted.");
            navigate("/listings");
        }catch(err) {
            alert("Failed to delete your job.");
            console.warn(err || "An error occurred while deleting your job.");
        }
    };

    const handleOpenQuotePopup = () => {
        setQuotePopupOpen(true);
    };

    const handleCloseQuotePopup = () => {
        setQuotePopupOpen(false);
    };

    const handleQuoteSubmit = async (comment: string, price: number) => {
        alert(user?.id);
        try {
          const response = await api.post('/quotes/create', {
            jobId: job?.id,
            comment,
            price,
          });
          console.log('Quote created:', response.data);
          alert('Quote submitted successfully!');
        } catch (err) {
          console.error('Failed to submit quote', err);
          alert('Failed to submit quote. Please try again.');
        }
      };

    if(loading || !user) {
        return <div className="loader-overlay"><div className="loader"/></div>
    }


    const view = 
    !job || error ? <></> :
    <>
   
    <div className="title"><h2>Job - {job?.title}</h2> {job?.freelancerUsername && <span className='tag'>Taken</span>} (<a className="job-id">ID: {job?.id}</a>)</div>
    <div className="job">
    <div className="details">
        <b>Published by: </b><a href={`/profile/${job?.username}`} className="text-link">{job?.username}</a>
    </div>
    
        <div className="description">
    
            <p className="description-text">{job?.description}</p>
            <div>
                <p><b>Role: </b><span>{meta.icon}{meta.label}</span></p>
                <p><b>Budget: </b>${job?.budget}</p>
                <p><b>Deadline: </b>{job?.deadline ? formatDate(job?.deadline) : "N/A"}</p>
                <p><b>Taken by: </b>{job?.freelancerUsername ? <a href={`/profile/${job?.freelancerUsername}`} className="text-link">(Freelancer) {job?.freelancerUsername}</a> : "None"}</p>{}
              
            </div>

            <div className="buttons">
                <div className="general">
                {isFreelancer && job.username !== user.username && <a onClick={handleOpenQuotePopup} className="btn btn-primary">Quote</a>}
                {job.username === user.username && <a className='btn btn-primary not-allowed' onClick={(e)=>{alert("This action is currently disabled.")}}>Edit</a>}
                {(job.username === user.username || user.isAdmin) && <a href="" className="btn btn-danger" onClick={handleDeletion}>Delete</a>}
                </div>
                <a href="#" className="report"><img src="/src/assets/images/danger.svg" alt="report"/></a>
            </div>
        </div>

    </div>
    <QuotePopup isOpen={isQuotePopupOpen} onClose={handleCloseQuotePopup} onSubmit={handleQuoteSubmit}/>
    </>;

    const applicable = user && job && !error && (job?.state ==="Open" || (job.username===user.username || user.isAdmin || job.freelancerUsername === user.username));

    return (
        <>
            {user ? <SignedNavbar active="" /> : <Navbar active="" />}
            <div className="job-container">
                {applicable ? view : (
                    <p style={{ textAlign: "center", fontWeight: "450", fontSize: "20px" }}>
                        Job was not found.
                    </p>
                )}
            </div>
            <Footer />
        </>
    );


}

export default JobPage;
