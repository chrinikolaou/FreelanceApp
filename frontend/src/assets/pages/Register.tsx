import '../style/pages/register.css';

function Register() {
    
    return (
        <div className="auth-register">

            <form>
            <h2>Sign up to Freelance.com</h2>
                <div className="input-group">
                <img src="/src/assets/images/account.svg"/>
                    <input type="text" placeholder="Email" required/>
                </div>
          
                <div className="input-group">
                    <img src="/src/assets/images/lock.svg"/>
                    <input type="password" placeholder="Password" required/>
                </div>

                <div className="input-group">
                    <img src="/src/assets/images/lock.svg"/>
                    <input type="password" placeholder="Confirm Password" required/>
                </div>

        
                <div className="checkbox-group">
                    <label className="custom-checkbox" htmlFor="accept_tos">
                        <input type="checkbox" name="accept_tos" id="accept_tos" required/>
                        <span className="checkmark"></span> Accept the <a href="/terms" className="text-link">Terms Of Services</a>
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