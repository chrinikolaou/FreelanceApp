import '../style/pages/login.css';

function Login() {
    
    return (
        <div className="auth-login">

            <form>
            <h2>Log in to Freelance.com</h2>
                <div className="input-group">
                <img src="/src/assets/images/account.svg"/>
                    <input type="text" placeholder="Email" required/>
                </div>
          
                <div className="input-group">
                    <img src="/src/assets/images/lock.svg"/>
                    <input type="password" placeholder="Password" required/>
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
                <a className="text-link" href="/user/register">Don't have an account? Sign up.</a>
            </form>
        </div>
    );
}

export default Login