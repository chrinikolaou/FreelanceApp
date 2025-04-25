import '../style/pages/register.css';
import api from '../../AxiosInstance';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Register() {
    
    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [address, setAddress] = useState('');
    const [gender, setGender] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);


    const imageUrl = gender === 'Male' ? 'avatar_man_1.svg' : gender === 'Female' ? 'avatar_woman_1.svg' : '';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if(password !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }

        try {
            await api.post("/auth/register", {
                username: username,
                password: password,
                email: email,
                firstName: firstName,
                lastName: lastName,
                address: address, 
                isAdmin: isAdmin,
                imageUrl
            });
            alert('You have successfully register.');
            navigate('/login');
        } catch(error: any) {
            alert(error.response?.data?.message || "An error occurred during the registration.");
        }

    };


    return (
        <div className="auth-register">

            <form onSubmit={handleSubmit}>
            <h2>Sign up to VFreelance.com</h2>
                <div className="input-group">
                <img src="/src/assets/images/account.svg"/>
                    <input type="email" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} required/>
                </div>

                <div className="input-group">
                <img src="/src/assets/images/account.svg"/>
                    <input type="text" placeholder="Username" value={username} onChange={(e)=>setUsername(e.target.value)} required/>
                </div>

          
                <div className="input-group">
                    <img src="/src/assets/images/lock.svg"/>
                    <input type="password" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)} required/>
                </div>

                <div className="input-group">
                    <img src="/src/assets/images/lock.svg"/>
                    <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e)=>
                        setConfirmPassword(e.target.value)} required/>
                </div>

                <div className="input-group">
                    <img src="/src/assets/images/id_card.svg"/>
                    <input type="text" placeholder="First Name" 
                    value={firstName} onChange={(e)=>setFirstName(e.target.value)} required/>
                </div>

                <div className="input-group">
                    <img src="/src/assets/images/id_card.svg"/>
                    <input type="text" placeholder="Last Name" 
                    value={lastName} onChange={(e)=>setLastName(e.target.value)} required/>
                </div>
                                
                <div className="input-group">
                <img src="/src/assets/images/address.svg"/>
                    <input type="text" placeholder="Address" 
                    value={address} onChange={(e)=>setAddress(e.target.value)} required/>
                </div>

                <select className="select" value={gender} onChange={(e) => setGender(e.target.value)}>
                    <option value="">Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                </select>

        
                <div className="checkbox-group">
                    <label className="custom-checkbox" htmlFor="accept_tos">
                        <input type="checkbox" name="accept_tos" id="accept_tos" required/>
                        <span className="checkmark"></span> Accept the <a href="/legal/terms" className="text-link" >Terms Of Services</a>
                    </label>
                </div>

                <div className="checkbox-group">
                    <label className="custom-checkbox" htmlFor="admin">
                        <input type="checkbox" name="admin" id="admin" 
                        checked={isAdmin} onChange={(e)=>setIsAdmin(e.target.checked)}/>
                        <span className="checkmark"></span><a>Register as Administrator?</a>
                    </label>
                </div>


                <button type="submit" className="btn btn-primary">Sign up</button>
                <hr/>
                <a className="text-link" href="/user/login">Already have an account? Sign in.</a>
            </form>
        </div>
    );
}

export default Register