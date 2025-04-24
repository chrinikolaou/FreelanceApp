import { redirect, useParams } from 'react-router-dom';
import api from '../../AxiosInstance';
import { useJob } from '../hooks/useJob';
import { useAuth } from '../hooks/useAuth';
import SignedNavbar from '../components/home/child/SignedNavbar';
import Navbar from '../components/home/child/Navbar';
import '/src/assets/style/job.css';
import Footer from '../components/global/Footer';
import { RoleByOrdinal } from '../models/Role';
import { RoleMetaMap } from '../models/meta/RoleMeta';
import { useState } from 'react';
import QuotePopup from '../components/global/QuotePopup';

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

    const handleOpenQuotePopup = () => {
        setQuotePopupOpen(true);
    };

    const handleCloseQuotePopup = () => {
        setQuotePopupOpen(false);
    };

    if(loading) {
        return <div className="loader-overlay"><div className="loader"/></div>
    }



    const view = 
    <>
    <div className="title"><h2>Job - {job?.title}</h2> (<a className="job-id">ID: {job?.id}</a>)</div>
    <div className="job">
    <div className="details">
        <b>Published by: </b><img src="/src/assets/images/avatar_man_1.svg" className="avatar" alt="avatar"/><a href="#" className="text-link">{job?.username}</a>
    </div>
    
        <div className="description">
    
            <p className="description-text">{job?.description}</p>
            <div>
                <p><b>Role: </b><span color={meta.color}>{meta.icon}{meta.label}</span></p>
                <p><b>Budget: </b>${job?.budget}</p>
                <p><b>Deadline: </b>{formatDate(job?.deadline)}</p>
              
            </div>

            <div className="buttons">
                <div className="general">
                <a onClick={handleOpenQuotePopup} className="btn btn-primary">Quote</a>
                <a href="" className="btn btn-secondary">Message</a>
                {/* If user is an admin */}<a href="" className="btn btn-danger">Delete</a>
                </div>
                <a href="#" className="report"><img src="/src/assets/images/danger.svg" alt="report"/></a>
            </div>
        </div>

    </div>
    <QuotePopup isOpen={isQuotePopupOpen} onClose={handleCloseQuotePopup} />
    </>;

    return (
        <>
            {user ? <SignedNavbar active=""/> : <Navbar active=""/>}
            <div className="job-container">
                
            {user && (job ? view : <p>Job was not found.</p>)}
            </div>
            <Footer/>
        </>
    );


}

export default JobPage;
