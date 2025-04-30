import { useState } from 'react';
import '../style/pages/login.css';
import AxiosInstance from '../../AxiosInstance';
import { useNavigate } from 'react-router-dom';

function Login() {
    
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        try {

            const response = await AxiosInstance.post(`/auth/login`, {
                username,
                password
            });

            
            console.log(response);
            console.log("Login successful");
            navigate("/");
        } catch (err) {
            console.log('Login Error: ', err);
        }
    }

    return (
        <div className="auth-login">

            <form onSubmit={handleSubmit}>
            <h2>Log in to VFreelance.com</h2>
                <div className="input-group">
                <img src="/src/assets/images/account.svg"/>
                    <input type="text" placeholder="Username" value={username} onChange={(e)=>setUsername(e.target.value)} required/>
                </div>
          
                <div className="input-group">
                    <img src="/src/assets/images/lock.svg"/>
                    <input type="password" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)} required/>
                </div>

                <div className="group">
                <div className="checkbox-group">
                    <label className="custom-checkbox" htmlFor="keep_me_logged_in">
                        <input type="checkbox" name="keep_me_logged_in" id="keep_me_logged_in"/>
                        <span className="checkmark"></span> Keep me logged in
                    </label>
                </div>
                <a className="text-link" href="">Forgot Password?</a>
                </div>

                <button type="submit" className="btn btn-primary">Log in</button>
                <hr/>
                <a className="text-link" href="/register">Don't have an account? Sign up.</a>
            </form>
        </div>
    );
}

export default Login