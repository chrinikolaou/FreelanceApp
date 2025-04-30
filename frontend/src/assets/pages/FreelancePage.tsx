import { HTMLFormMethod, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import SignedNavbar from "../components/home/child/SignedNavbar";
import Footer from "../components/global/Footer";
import { FormEvent, useEffect, useState } from "react";
import { Role, RoleByOrdinal } from "../models/Role";
import { RoleMetaMap } from "../models/meta/RoleMeta";
import api from '../../AxiosInstance';
import '../style/pages/freelance.css';
import { useIsFreelancer } from "../hooks/useIsFreelancer";

function FreelancePage() {
    const {user, logout} = useAuth();
    const navigate = useNavigate();
    const [biography, setBiography] = useState<string>('');
    const [role, setRole] = useState<number>(0);
    const {isFreelancer} = useIsFreelancer();

        if(!user) {
            return navigate("/login");
        }


    const handleSubmission = async (e: FormEvent) => {
        e.preventDefault();

        try {
            const response = await api.post("/user/freelancer/register", {
                biography: biography,
                role: role,
                balance: 0,
            });
            alert('You have successfully registered as a freelancer.');
            navigate("/account/information");

        } catch(error) {
            alert("Failed to register as a freelancer.");
            console.warn(error || "An error occurred while registerting as a freelancer.");
        }

    }

    if(isFreelancer) {

        return (
            <>  
                <SignedNavbar active="freelance"/>
                <div className="no-freelance-container">
                
                <h2>You are already a freelancer.</h2>
                <a href="/account/information" className="btn btn-primary">View My Profile</a>
                </div>
                <Footer/>
            </>
        );
    }

    return (
        <>  
            <SignedNavbar active="freelance"/>
            <div className="freelance-container">
                <form onSubmit={handleSubmission}>
                <h2>Fill out the fields.</h2>
               
        
                <textarea placeholder="Biography" value={biography} onChange={(e)=>setBiography(e.target.value)} required/>
                <select className="select" value={role} onChange={(e)=>setRole(Number(e.target.value))} defaultValue={role}>
                    {RoleByOrdinal.map((role, index) => (
                        <option key={index} value={index}>
                        {RoleMetaMap[role].icon} {RoleMetaMap[role].label}
                        </option>
                    ))}
                </select>
                <button type="submit" className="btn btn-primary">Start Freelancing</button>
                </form>
            </div>
            <Footer/>
        </>
    );
}

export default FreelancePage;