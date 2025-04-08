import '/src/assets/style/quote.css';

function Quote() {

    return (
        <div className="quote-container">
            <img src="/src/assets/images/politician.svg"/>
            <div className="text">
                
                <div className="adv">
                <img src="/src/assets/images/star.svg"/> 
                    <div className="heading">
                        <h2>Highly qualified and well established freelancers</h2>
                        <p>All our freelancers are reviewed by our professional team and meet the highest standards we strive to provide.</p>
                    </div>
                    
                </div>

                <div className="adv">
                <img src="/src/assets/images/refund.svg"/> 
                    <div className="heading">
                        <h2>Full refund coverage</h2>
                        <p>Rest assured we provide full refund of your money if you are not satisfied with your order.</p>
                    </div>
                    
                </div>

                <div className="adv">
                <img src="/src/assets/images/support.svg"/> 
                    <div className="heading">
                        <h2>24/7 Support</h2>
                        <p>Our dedicated team is available 24/7 to provide you with support whenever you need it. 
                            Whether it’s day or night, we're always here to help.</p>
                    </div>
                    
                </div>
            

            </div>

        </div>
       
    );

}

export default Quote