import { Link, useNavigate, useParams } from "react-router-dom";
import Footer from "../components/global/Footer";
import SignedNavbar from "../components/home/child/SignedNavbar";
import { useReceivedRatings } from "../hooks/useReceivedRatings";
import { useSentRatings } from "../hooks/useSentRatings";
import { Profile } from "../models/Profile";
import { useUserProfile } from "../hooks/useUser";
import { Rating } from "../models/Rating";
import '../style/pages/account.css';
import { FormEvent, useState } from "react";
import { useIsFreelancerOther } from "../hooks/useIsFreelancerOther";

interface ProfileProps {
    active: string;
}

interface UserProps {
    profile: Profile;
}


function Information({profile}: UserProps) {
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
          <td>{profile.userName ? profile.userName : "Not specified"}</td>
          <td>{profile.email ? profile.email : "Not specified"}</td>
          <td>{profile.address ? profile.address : "Not specified"}</td>
          <td>{profile.biography ? profile.biography : "Not specified"}</td>
          <td>{profile.completedJobs}</td>
          <td>${profile.balance}</td>
          <td></td>
        </tr>
      </tbody>
    </table>
        </>
    );
}

function SentRatings({profile}: UserProps) {
    const { ratings, loading } = useSentRatings(profile.id);
    
    if (loading) return <p>Loading ratings...</p>;

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
                    <tr><td colSpan={6}>User hasn't sent any ratings.</td></tr>
                ) : (
                    ratings.map((rating: Rating) => (
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

function ReceivedRatings({ profile }: UserProps) {
    const { ratings, loading } = useReceivedRatings(profile.id);

    if (loading) return <p>Loading ratings...</p>;

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
                    <tr><td colSpan={6}>User hasn't received any ratings.</td></tr>
                ) : (
                    ratings.map((rating: Rating) => (
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

export default function ProfileOtherPage({ active = "information" }: ProfileProps) {
    const { username } = useParams<{ username: string }>();
    const { profile, loading, error } = useUserProfile(username);
    const {isFreelancerOther, loading: freelancerLoading} = useIsFreelancerOther(username);
    const navigate = useNavigate();
    const [target, setTarget] = useState<string>('');

    function searchUser(e: FormEvent) {
        return navigate("/profile/"+target);
    }
    
    if (loading || freelancerLoading) return <div className="loader-overlay"><div className="loader"/></div>;
    if(!profile && error) {
        return (
        <>
        <SignedNavbar active=""/>
            <div className="no-account-container">
                <p>User was not found.</p>
                <form className="search_nav" method="get" onSubmit={searchUser}>
                <div className="input-group search_div">
                    <label htmlFor="input_search">
                        <img src="/src/assets/images/search.svg"/>
                        <input type="text" name="input_search" id="input_search" placeholder="Search User" value={target} onChange={(e)=>setTarget(e.target.value)}/></label>                
                </div>
                <button type="submit" className="btn btn-primary">Search</button>
            </form>
            </div>
            <Footer />
        </>
        );
    }


    return (
        <>
            <SignedNavbar active=""/>
            <div className="account-container">
            <div className="profile">
                    <div className="avatar">
                    <img src={`/src/assets/images/${profile?.imageUrl ? profile?.imageUrl : "avatar_man_1.svg"}`} alt="Avatar"/>
                    <div className="account-name">
                      <h3>{profile?.firstName} {profile?.lastName}</h3>
                      {isFreelancerOther && <span className="freelancer-tag">Freelancer</span>}
                    </div>
                    <div className="actions">
                    <Link to={`/profile/${profile?.userName}/information`} className={`text-link ${active === "information" ? "active" : ""}`}>Information</Link>
                    <Link to={`/profile/${profile?.userName}/ratings/received`} className={`text-link ${active === "received-ratings" ? "active" : ""}`}>Received Ratings</Link>
                    <Link to={`/profile/${profile?.userName}/ratings/sent`} className={`text-link ${active === "sent-ratings" ? "active" : ""}`}>Sent Ratings</Link>
                    </div>
                    </div>
                   
                <div className="adjustableSection">
                    {active === "information" && <Information profile={profile} />}
                    {active === "sent-ratings" && <SentRatings profile={profile} />}
                    {active === "received-ratings" && <ReceivedRatings profile={profile} />}
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}
