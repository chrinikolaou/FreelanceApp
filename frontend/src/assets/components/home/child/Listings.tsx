import { useJobs } from '../../../hooks/useJobs';
import { useUserProfile } from '../../../hooks/useUser';
import { Job } from '../../../models/Job';
import '/src/assets/style/listings.css';

function formatDate(dateString: string) : string {
    const date = new Date(dateString);

    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
    });
}


function Listings() {
    const {jobs, loading} = useJobs();


    if(loading) return <div className='loader-overlay'><div className='loader'/></div>;

    const JobCard = ({job}: {job: Job}) => {

        const { profile, loading: userLoading } = useUserProfile(job.username);

        if(userLoading) return <div className='loader-overlay'><div className='loader'/></div>;

        return (
        <div className="card">
        <div className="card-details">
        <img src={`/src/assets/images/${profile.imageUrl}`}/>
        <p>{formatDate(job.createdAt)}</p>
        </div>
        
        <p>{job.description}</p>
        <div className="card-buttons">
        <a href={`/listings/${job.id}`} className="text-link">Learn More...</a>
        </div>
    </div>
        );
    }

    return (
        <div className="listings-container">
            <div className="text">
                <h2>Latest Listings</h2>
                <a href="/listings" className="nav-link text-tertiary active">View all</a>
            </div>
            <div className="listings">
            {jobs.length == 0 && <p className="empty-jobs"><b>No available jobs at the moment.</b></p>}
            {jobs.filter(j=>j.state==="Open").map(job=> (
               <JobCard key={job.id} job={job}/>
            ))}

            </div>
        </div>
    );


}

export default Listings