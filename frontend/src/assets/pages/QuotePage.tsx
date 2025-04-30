import { HTMLFormMethod, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import SignedNavbar from "../components/home/child/SignedNavbar";
import Footer from "../components/global/Footer";
import { FormEvent, useEffect, useState } from "react";
import { Role, RoleByOrdinal } from "../models/Role";
import { RoleMetaMap } from "../models/meta/RoleMeta";
import api from '../../AxiosInstance';
import '../style/pages/quote.css';

function QuotePage() {
    const {user, logout} = useAuth();
    const navigate = useNavigate();
    const [title, setTitle] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [category, setCategory] = useState<string>('');
    const [budget, setBudget] = useState<number>(5);
    const [deadline, setDeadline] = useState<string | null>(null);
    const [role, setRole] = useState<number>(0);

        if(!user) {
            return navigate("/login");
        }


    const handleSubmission = async (e: FormEvent) => {
        e.preventDefault();
        console.log(title, description, category, budget, deadline, role);

        try {
            const response = await api.post("/jobs/create", {
                title: title,
                description: description,
                category: role,
                budget: budget,
                deadline: deadline
            });
            alert('You have posted a new job.');
            navigate(`/listings/${response.data.id}`);

        } catch(error) {
            alert("Failed to post your job.");
            console.warn(error || "An error occurred while posting your job.");
        }

    }

    return (
        <>  
            <SignedNavbar active="quote"/>
            <div className="quote-container">
                <form onSubmit={handleSubmission}>
                <h2>Fill out the fields.</h2>
                <div className="input-group">
                <img src="/src/assets/images/comment.svg"/>
                    <input type="text" placeholder="Title" value={title} onChange={(e)=>setTitle(e.target.value)} required/>
                </div>
               
        
                <textarea placeholder="Description" value={description} onChange={(e)=>setDescription(e.target.value)} required/>
                <select className="select" value={role} onChange={(e)=>setRole(Number(e.target.value))} defaultValue={role}>
                    {RoleByOrdinal.map((role, index) => (
                        <option key={index} value={index}>
                        {RoleMetaMap[role].icon} {RoleMetaMap[role].label}
                        </option>
                    ))}
                </select>

                <div className="input-group">
                <img src="/src/assets/images/money.svg"/>
                <label><input type="number" placeholder="Budget" value={budget} min="5" step={0.01} onChange={(e)=>setBudget(Number(e.target.value))} required/> $</label>
                   
                </div>

                <div className="input-group">
                    
                    <input type="date" placeholder="Deadline" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
                </div>
                <button type="submit" className="btn btn-primary">Get A Quote</button>
                </form>
            </div>
            <Footer/>
        </>
    );
}

export default QuotePage;