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
import { Profile } from "../models/Profile";
import { useUserProfile } from "../hooks/useUser";
import { useCompletedJobs } from "../hooks/useCompletedJobs";
import { useRating } from "../hooks/useRating";
import { useEffect, useState } from "react";
import { Rating } from "../models/Rating";
import RatingPopup from "../components/global/RatingPopup";
import AdminPopup from "../components/global/AdminPopup";
import { RoleMetaMap } from "../models/meta/RoleMeta";
import { Role, RoleByOrdinal } from "../models/Role";

interface ProfileProps {
    active: string;
}

interface UserProps {
  user: User;
}

interface QuoteProps {
  quote: Quote;
}

function Information({profile}: {profile: Profile}) {
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
          <th>Biography</th>
          <th>Jobs Completed</th>
          <th>Balance</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{profile.firstName ? profile.firstName : "Not specified"}</td>
          <td>{profile.lastName ? profile.lastName : "Not specified"}</td>
          <td>{profile.username ? profile.username : "Not specified"}</td>
          <td>{profile.email ? profile.email : "Not specified"}</td>
          <td>{profile.address ? profile.address : "Not specified"}</td>
          <td>{profile.biography ? profile.biography : "Not specified"}</td>
          <td>{profile.completedJobs ? profile.completedJobs : "None"}</td>
          <td>${profile.balance ? profile.balance : "0.0"}</td>
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

  function CompletedJobs({user}: UserProps) {
    const { completedJobs, loading} = useCompletedJobs();
    const [ratings, setRatings] = useState<Record<number, Rating | null>>({});
    const [loadingRatings, setLoadingRatings] = useState<boolean>(true);
    const [isRatingPopupOpen, setRatingPopupOpen] = useState(false); 

    useEffect(() => {
      const fetchRatings = async () => {
        const fetchedRatings: Record<number, Rating | null> = {};
    
        for (const job of completedJobs) {
          try {
            const response = await api.get<Rating>(`/ratings/completedJob/${job.id}`);
            fetchedRatings[job.id] = response.data || null;
          } catch (error) {
            console.warn(`Failed to fetch rating for job ${job.id}:`, error);
            fetchedRatings[job.id] = null; 
          }
          finally {
            setLoadingRatings(false);
          }
        }
    
        setRatings(fetchedRatings);
        setLoadingRatings(false);
      };
    
      if (completedJobs.length > 0) {
        fetchRatings();
      }
      setLoadingRatings(false);
    }, [completedJobs]);
  

    if (loading || loadingRatings) return <div className="loader-overlay"><div className="loader" /></div>;
  
    const handleOpenRatingPopup = () => {
      setRatingPopupOpen(true);
  };

  const handleCloseRatingPopup = () => {
      setRatingPopupOpen(false);
  };

  const handleRatingSubmit = async (completedJobId: number, comment: string, rate: number) => {
      
    try {
      const response = await api.post('/ratings', {
        completedJobId: completedJobId,
        rate: rate,
        comment: comment,
      });
    
      console.log('Rating created:', response.data);
      alert('Rating submitted successfully!');
    } catch (err) {
      console.error('Failed to submit rating.', err);
      alert('Failed to submit rating. Please try again.');
    }
  }    

    return (
      <table>
        <thead>
          <tr>
            <th>Job ID</th>
            <th>Title</th>
            <th>Status</th>
            <th>Created At</th>
            <th>Freelancer</th>
            <th>Rating</th>
          </tr>
        </thead>
        <tbody>
          {completedJobs.length === 0 ? (
            <tr><td colSpan={5}>You don't have any completed job yet.</td></tr>
          ) : (
            completedJobs.map((job) => (
            
              <tr key={job.id}> 
                <td>{job.id}</td>
                <td>{job.jobTitle}</td>
                <td>Completed</td>
                <td>{new Date(job.completedAt).toLocaleDateString()}</td>
                <td><a href={`/profile/${job.freelancerUsername}`} className="text-link">{job.freelancerUsername}</a></td>
                <td className="buttons">
                  {user.username !== job.freelancerUsername && 
                  
                  ( ratings[job.id] ? <p>{ratings[job.id]?.rate}/5 - {ratings[job.id]?.comment}</p> : <a className="btn btn-primary" onClick={handleOpenRatingPopup}>Rate Freelancer</a>)
                  }
                  {user.username === job.freelancerUsername && (
                    ratings[job.id] ? (
                      <p>{ratings[job.id]?.rate}/5 - {ratings[job.id]?.comment}</p>
                    ) : (
                      <p>Not Rated Yet.</p>
                    )
                  )}
                  <RatingPopup isOpen={isRatingPopupOpen} onClose={handleCloseRatingPopup} completedJobId={job.id} onSubmit={handleRatingSubmit}/>
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
            <th>Evaluation</th>
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
                <td>{quote.decision ? quote.decision : "N/A"}</td>
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
  
  if(loading) return (
    <table>
      <thead>
        <tr>
          <th>Rating</th>
          <th>To</th>
          <th>Comment</th>
        </tr>
      </thead>

      <tbody>
        <tr><td>You haven't sent any ratings.</td></tr>
      </tbody>
    </table>
);

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
                <td>{rating.freelancerUsername || "Unknown"}</td>
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
  if(loading) return (
      <table>
        <thead>
          <tr>
            <th>Rating</th>
            <th>From</th>
            <th>Comment</th>
          </tr>
        </thead>
  
        <tbody>
          <tr><td>You haven't received any ratings.</td></tr>
        </tbody>
      </table>
  );

  return (
    <table>
      <thead>
        <tr>
          <th>Rating</th>
          <th>From</th>
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
                <td>{rating.username || "Unknown"}</td>
                <td>{rating.comment || "No message"}</td>
              </tr>
            ))
          )}
      </tbody>
    </table>
  );
}


export default function ProfilePage({active = "information"}: ProfileProps) {
    
    const {user, authChecked} = useAuth();
    const {profile, loading: profileLoading} = useUserProfile(user?.username);
    const { notifications, loading, error, markAsRead} = useNotifications(user?.id || null);
    const {isFreelancer} = useIsFreelancer();
    const [isAdminPanelOpen, setIsAdminPanelOpen] = useState<boolean>(false);

    const handleAdminSubmit = async (
      firstName: string,
      lastName: string,
      username: string,
      password: string,
      email: string,
      address: string,
      bio: string,
      balance: number,
      action: string,
      role: number
    ) => {
      if(username.trim().length < 3) {
        alert("Username must be at-least three letters long.");
        return;
      }


      switch(action) {

          case "create":
          try {
            const response = await api.post("/admin/create/user", {
              username: username,
              password: password,
              firstname: firstName,
              lastname: lastName, 
              email: email,
              address: address,
              imageUrl: "avatar_man_1.svg", 
              isAdmin: false,
              
            }); 
           
            alert("User " + username + " has been created successfully.");
          } catch(err: any) {
            alert(err.response.data);
            console.warn(err || "An error occurred while creating a user.");
          }
          break;

          case "edit":
            try {
              const response = await api.put(`/admin/update/user/${username}`, {
                previousUsername: username,
                firstname: firstName,
                lastname: lastName, 
                email: email,
                address: address,
                imageUrl: "avatar_man_1.svg",
                bio: bio,
                role: role
                
              }); 
              
              alert("User " + username + " has been updated successfully.");
            } catch(err: any) {
              alert(err.response.data);
              console.warn(err || "An error occurred while updating a user.");
            }
          break;

          case "delete":
            try {
              const response = await api.post(`/admin/delete/user/${username}`);
              alert("User " + username + " has been deleted successfully.");  
              
            } catch(err: any) {
              alert(err.response.data);
              console.warn(err || "An error occurred while deleting a user.");
            }
          break;
      }

    };

    if (!authChecked || loading || !user || !notifications) {
        return <div className="loader-overlay"><div className="loader"/></div>
      }


      if(profileLoading) {
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
                      {user?.isAdmin && <span className="admin-tag">Admin</span>}
                    </div>
                    </div>
                    <div className="actions">
                    <Link to="/account" className={`text-link ${active === "information" ? "active" : ""}`}>Information</Link>
                    <Link to="/account/jobs" className={`text-link ${active === "jobs" ? "active" : ""}`}>My Jobs</Link>
                    <Link to="/account/completed" className={`text-link ${active === "completed" ? "active" : ""}`}>My Completed Jobs</Link>
                    <Link to="/account/work" className={`text-link ${active === "work" ? "active" : ""}`}>My Work</Link>
                    <Link to="/account/quotes" className={`text-link ${active === "quotes" ? "active" : ""}`}>My Quotes</Link>
                    <Link to="/account/ratings/received" className={`text-link ${active === "received-ratings" ? "active" : ""}`}>Received Ratings</Link>
                    <Link to="/account/ratings/sent" className={`text-link ${active === "sent-ratings" ? "active" : ""}`}>Sent Ratings</Link>
                    {!isFreelancer && <Link to="/freelancing" className="btn btn-primary">Become a Freelancer</Link>}
                    {user.isAdmin && <a href="#" className="btn btn-danger" onClick={()=>setIsAdminPanelOpen(true)}>Admin Panel</a>}
                 
                    </div>
                </div>

                <div className="adjustableSection">
                    {active==="information" && profile && <Information profile={profile}/>}
                    {active==="jobs" && <Jobs/>}
                    {active==="completed" && <CompletedJobs user={user}/>}
                    {active==="work" && <Work/>}
                    {active==="quotes" && <Quotes user={user}/>}
                    {active==="sent-ratings" && <SentRatings user={user}/>}
                    {active==="received-ratings" && <ReceivedRatings user={user}/>}
                    {user.isAdmin && active==="admin"}
                    <AdminPopup isOpen={isAdminPanelOpen} onClose={()=>setIsAdminPanelOpen(false)} onSubmit={handleAdminSubmit}/>
                </div>
            </div>
            <Footer/>
        </>
    );
}