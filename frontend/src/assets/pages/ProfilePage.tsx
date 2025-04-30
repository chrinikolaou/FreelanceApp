import { Link, redirect } from "react-router-dom";
import Footer from "../components/global/Footer";
import SignedNavbar from "../components/home/child/SignedNavbar";
import { useAuth } from "../hooks/useAuth";
import { useNotifications } from "../hooks/useNotifications";
import '/src/assets/style/pages/account.css';
import '/src/assets/models/User';
import { useMyQuotes } from "../hooks/useMyQuotes";
import { useReceivedQuotes } from "../hooks/useReceivedQuotes";
import { useMyJobs } from "../hooks/useMyJobs";
import { getQuoteState, Quote } from "../models/Quote";
import api from "../../AxiosInstance";
import { User } from "../models/User";
import { useMySentRatings } from "../hooks/useMySentRatings";
import { useMyReceivedRatings } from "../hooks/useMyReceivedRatings";
import { useIsFreelancer } from "../hooks/useIsFreelancer";
import { useWorkJobs } from "../hooks/useWorkJobs";
import { Job } from "../models/Job";

interface ProfileProps {
    active: string;
}

interface UserProps {
    user: User;
}

interface QuoteProps {
  quote: Quote;
}

function Information({user}: UserProps) {
    return (
        <>
    <table>
      <thead>
        <tr>
          <th>First Name</th>
          <th>Last Name</th>
          <th>User Name</th>
          <th>Email</th>
          <th>Address</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{user.firstName ? user.firstName : "Not specified"}</td>
          <td>{user.lastName ? user.lastName : "Not specified"}</td>
          <td>{user.username ? user.username : "Not specified"}</td>
          <td>{user.email ? user.email : "Not specified"}</td>
          <td>{user.address ? user.address : "Not specified"}</td>
        </tr>
      </tbody>
    </table>
        </>
    );
}

function Work() {
  const {jobs, loading} = useWorkJobs();
  if (loading) return <div className="loader-overlay"><div className="loader" /></div>;

  const handleFinishElement = async ({job}: {job: Job}) => {
    try {
      if(!confirm("Are you sure you have finished this work?")) return;
      await api.post(`jobs/${job.id}/complete`);
      alert("Sent a finish request. Waiting for job owner's confirmation.");
    } catch(err) {
      alert(err.response.data || "Waiting for job owner's confirmation.");
      console.warn(err || "An error occurred while completing the work.");
    }
   
  }

  return (
    <table>
      <thead>
        <tr>
          <th>Job ID</th>
          <th>Job Owner</th>
          <th>Title</th>
          <th>Description</th>
          <th>Status</th>
          <th>Created At</th>
          <th>Deadline</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {jobs.length === 0 ? (
          <tr><td colSpan={5}>You don't have any jobs yet.</td></tr>
        ) : (
          jobs.map((job) => (
          
            <tr key={job.id}>
              <td>{job.id}</td>
              <td>{job.username}</td>
              <td>{job.title}</td>
              <td>{job.description.length > 50 ? job.description.substring(0, 50) + "..." : job.description}</td>
              <td>{job.state}</td>
              <td>{new Date(job.createdAt).toLocaleDateString()}</td>
              <td>{job.deadline ? new Date(job.deadline).toLocaleDateString() : "N/A"}</td>
              <td><a className="btn btn-primary" onClick={()=>handleFinishElement({job: job})}>Finish</a></td>
            </tr>
            
          ))
        )}
      </tbody>
    </table>
  );
}

function Jobs() {
    const { jobs, loading, error } = useMyJobs();
  
    if (loading) return <div className="loader-overlay"><div className="loader" /></div>;

    const handleConfirmElement = async ({job}: {job: Job}) => {
      try {
        if(!confirm("Are you sure you want to confirm the job's finish?")) return;
        await api.post(`jobs/${job.id}/confirm`);
        alert("You have confirmed and finalized this job.");
      } catch(err) {
        alert(err.response.data || "An error occurred while confirming this job.");
        console.warn(err || "An error occurred while confirming this job.");
      }
     
    }

    const handleProvokeElement = async ({job}: {job: Job}) => {
      try {
        if(!confirm("Are you sure you want to deny the job's finish?")) return;
        await api.post(`jobs/${job.id}/provoke`);
        alert("You have denied the finish request of this job.");
      } catch(err) {
        alert(err.response.data || "An error occurred while denying the finish request of this job.");
        console.warn(err || "An error occurred while denying the finish request of this job.");
      }
     
    }
  
    function ActionButtons ({job} : {job: Job}) {
      return (
        <>
            <Link to={"#"} className="btn btn-primary" onClick={()=>handleConfirmElement({job: job})}>Confirm Finish</Link>
            <Link to={"#"} className="btn btn-danger" onClick={()=>handleProvokeElement({job: job})}>Provoke Finish</Link>
        </>
      );
    }
    return (
      <table>
        <thead>
          <tr>
            <th>Job ID</th>
            <th>Title</th>
            <th>Description</th>
            <th>Status</th>
            <th>Created At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {jobs.length === 0 ? (
            <tr><td colSpan={5}>You don't have any jobs yet.</td></tr>
          ) : (
            jobs.map((job) => (
            
              <tr key={job.id}>
                <td>{job.id}</td>
                <td>{job.title}</td>
                <td>{job.description.length > 50 ? job.description.substring(0, 50) + "..." : job.description}</td>
                <td>{job.state}</td>
                <td>{new Date(job.createdAt).toLocaleDateString()}</td>
                <td className="buttons">
                  <Link to={`/listings/${job.id}`} className="btn btn-secondary">View</Link>
                  {job.state==="Pending" && <ActionButtons job={job}/>}
                  </td>
              </tr>
              
            ))
          )}
        </tbody>
      </table>
    );
  }

  function Quotes({user}: UserProps) {
    const { quotes: myQuotes, loading: myQuotesLoading, error: myQuotesError } = useMyQuotes();
    const { quotes: receivedQuotes, loading: receivedQuotesLoading, error: receivedQuotesError } = useReceivedQuotes();  

    if (myQuotesLoading || receivedQuotesLoading) return <div className="loader-overlay"><div className="loader"/></div>;

    const handleAcceptQuote = async ({ quote }: QuoteProps) => {
      try {
          await api.post(`/quotes/accept/${quote.id}`);
          alert(`You have successfully accepted the quote of ${quote.freelancerUsername} for $${quote.price}`);
      } catch (error) {
          alert(error.response.data);
          console.log(error || "An error occurred while accepting your quote.");
      }
  };

  const handleDeclineQuote = async ({quote}: QuoteProps) => {
      
      try {
          await api.post(`/quotes/decline/${quote.id}`);
          alert("You have successfully denied the quote of " + quote.freelancerUsername + " for " + quote.price);
      } catch(error) {
          if(error.response) alert(error.response.data || "An error occurred while denying your quote.");
          console.log(error || "An error occurred while denying your quote.");
      }
  }


  
  const handleCancelQuote = async ({quote}: QuoteProps) =>  {
      try {
          await api.post(`/quotes/cancel/${quote.id}`);
          alert("You have successfully canceled the quote of " + quote.freelancerUsername + " for $" + quote.price +
              " for the job ID: " + quote.jobId
          );
      } catch(error) {
          if(error.response) alert(error.response.data || "An error occurred while canceling your quote.");
          console.log(error || "An error occurred while canceling your quote.");
      }
  }

      function AddQuoteFunctions({ quote }: QuoteProps) {
          const handleQuoteAction = () => {
    
              if (quote?.quoteState === 2) {
                  handleCancelQuote({ quote: quote });
              } else {
                  handleDeclineQuote({ quote: quote });
              }
          };
      
          return (
              <>
                  <Link to="#" className={`btn btn-primary ${quote.quoteState !== 1 ? "not-allowed" : ""}`} onClick={() => handleAcceptQuote({ quote: quote })}>
                      Accept
                  </Link>
                  <Link to="#" className={`btn btn-danger ${quote.quoteState !== 1 && quote.quoteState !== 2 ? "not-allowed" : ""}`} onClick={handleQuoteAction}>
                      {quote?.quoteState === 2 ? "Cancel" : "Decline"}
                  </Link>
              </>
          );
      }

        
    const allQuotes = [...(myQuotes || []), ...(receivedQuotes || [])]; 

    async function cancelQuote(quoteId: number) {
        if (!window.confirm("Are you sure you want to cancel this quote?")) return;
    
        try {
          await api.delete(`/quotes/${quoteId}/delete`);
          alert("Quote cancelled successfully.");
          window.location.reload(); 
        } catch (error: any) {
          alert("Failed to cancel the quote.");
        }
      }

    return (
      <table>
        <thead>
          <tr>
            <th>Quote ID</th>
            <th>Message</th>
            <th>Price</th>
            <th>Job</th>
            <th>Freelancer</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {allQuotes.length === 0 ? (
            <tr><td colSpan={6}>You don't have any quotes yet.</td></tr>
          ) : (
            allQuotes.map((quote) => (
              
              <tr key={quote.id}>
                <td>{quote.id}</td>
                <td>{quote.comment || "No message"}</td>
                <td>${quote.price?.toFixed(2) || "N/A"}</td>
                <td><Link className="text-link" to={`/listings/${quote.jobId}`}>{quote.jobTitle || "Unknown"}</Link></td>
                <td>{quote.freelancerUsername || "Unknown"}</td>
                <td>{getQuoteState(quote.quoteState)}</td>
                
                <td className="buttons">
                {quote.quoteState == 1 && quote.freelancerUsername ===  user.username && <td><a className="btn btn-danger" onClick={()=>cancelQuote(quote.id)}>Cancel</a></td>}
                {quote.username === user.username && <AddQuoteFunctions quote={quote}/>}
                </td>
                
              </tr>
            ))
          )}
        </tbody>
      </table>
    );
  }
  
function SentRatings({user}: UserProps) {
  const {ratings, loading} = useMySentRatings();
  return (
    <table>
      <thead>
        <tr>
          <th>Rating</th>
          <th>To</th>
          <th>Comment</th>
        </tr>
      </thead>

      <tbody>
      {ratings.length === 0 ? (
            <tr><td colSpan={6}>You haven't sent any ratings.</td></tr>
          ) : (
            ratings.map((rating) => (
              <tr key={rating.id}>
                <td>{rating.rate}</td>
                <td>{rating.freelancer.user.username || "Unknown"}</td>
                <td>{rating.comment || "No message"}</td>
              </tr>
            ))
          )}
      </tbody>
    </table>
  );
}

function ReceivedRatings({user}: UserProps) {
  const {ratings, loading} = useMyReceivedRatings();
  return (
    <table>
      <thead>
        <tr>
          <th>Rating</th>
          <th>To</th>
          <th>Comment</th>
        </tr>
      </thead>

      <tbody>
      {ratings.length === 0 ? (
            <tr><td colSpan={6}>You haven't received any ratings.</td></tr>
          ) : (
            ratings.map((rating) => (
              <tr key={rating.id}>
                <td>{rating.rate}</td>
                <td>{rating.freelancer.user.username || "Unknown"}</td>
                <td>{rating.comment || "No message"}</td>
              </tr>
            ))
          )}
      </tbody>
    </table>
  );
}


export default function ProfilePage({active = "information"}: ProfileProps) {
    
    const {user, logout} = useAuth();
    const { notifications, loading, error, markAsRead} = useNotifications(user?.id || null);
    const {isFreelancer} = useIsFreelancer();

    if (loading || !user || !notifications) {
        return <div className="loader-overlay"><div className="loader"/></div>
      }

    return (
        <>
            <SignedNavbar active=""/>
            <div className="account-container">
                <div className="profile">
                    <div className="avatar">
                    <img src={`/src/assets/images/${user?.imageUrl ? user?.imageUrl : "avatar_man_1.svg"}`} alt="Avatar"/>
                    <div className="account-name">
                      <h3>{user?.firstName} {user?.lastName}</h3>
                      {isFreelancer && <span className="freelancer-tag">Freelancer</span>}
                    </div>
                    </div>
                    <div className="actions">
                    <Link to="/account" className={`text-link ${active === "information" ? "active" : ""}`}>Information</Link>
                    <Link to="/account/jobs" className={`text-link ${active === "jobs" ? "active" : ""}`}>My Jobs</Link>
                    <Link to="/account/work" className={`text-link ${active === "work" ? "active" : ""}`}>My Work</Link>
                    <Link to="/account/quotes" className={`text-link ${active === "quotes" ? "active" : ""}`}>My Quotes</Link>
                    <Link to="/account/ratings/received" className={`text-link ${active === "received-ratings" ? "active" : ""}`}>Received Ratings</Link>
                    <Link to="/account/ratings/sent" className={`text-link ${active === "sent-ratings" ? "active" : ""}`}>Sent Ratings</Link>
                    {!isFreelancer && <Link to="/freelancing" className="btn btn-primary">Become a Freelancer</Link>}
                 
                    </div>
                </div>

                <div className="adjustableSection">
                    {active==="information" && <Information user={user}/>}
                    {active==="jobs" && <Jobs/>}
                    {active==="work" && <Work/>}
                    {active==="quotes" && <Quotes user={user}/>}
                    {active==="sent-ratings" && <SentRatings user={user}/>}
                    {active==="received-ratings" && <ReceivedRatings user={user}/>}
     
                </div>
            </div>
            <Footer/>
        </>
    );
}