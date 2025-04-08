import '/src/assets/style/footer.css';

function Footer() {

    return (
        <footer>
            <div className="links">

                <div className="link">
                    <h3>For Clients</h3>
                    <a href="">Post a Job</a>
                    <a href="">Browse Freelancers</a>
                    <a href="">Your Projects</a>
                </div>

                <div className="link">
                    <h3>For Freelancers</h3>
                    <a href="">Find Work</a>
                    <a href="">Proposals</a>
                    <a href="">Earnings</a>
                </div>

                <div className="link">
                    <h3>Account</h3>
                    <a href="">Dashboard</a>
                    <a href="">Profile</a>
                    <a href="">Settings</a>
                </div>

                <div className="link">
                    <h3>Support</h3>
                    <a href="">Help Center</a>
                    <a href="">Contact Us</a>
                </div>

                <div className="link">
                    <h3>Legal</h3>
                    <a href="/legal/terms">Terms Of Service</a>
                    <a href="/legal/privacy">Privacy</a>
                    <a href="/legal/agreement">Agreements</a>
                </div>

            </div>
           <div className="media">
                <div className="icons">
                    <a href="#"><img src="/src/assets/images/twitter.svg" alt=""/></a>
                    <a href="#"><img src="/src/assets/images/linkedin.svg" alt=""/></a>
                    <a href="#"><img src="/src/assets/images/facebook.svg" alt=""/></a>
                </div>
                <p>&copy; VFreelance | All rights reserved.</p>
                <p>Designed by <a className="designer" href="https://github.com/chrinikolaou">chrinikolaou</a></p>
           </div>
        </footer>
    );


}


export default Footer;