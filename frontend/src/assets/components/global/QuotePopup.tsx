import { ChangeEvent, FormEvent, useState } from "react";
import '/src/assets/style/quotepopup.css';

interface QuotePopupProps {
    isOpen: boolean;
    onClose: () => void;
}

const QuotePopup: React.FC<QuotePopupProps> = ({isOpen, onClose}) => {
    const [price, setPrice] = useState<string>('');
    const [comment, setComment] = useState<string>('');

    const handlePriceChange = (e: ChangeEvent<HTMLInputElement>) => {
        setPrice(e.target.value);
    };

    const handleCommentChange = (e: ChangeEvent<HTMLInputElement>) => {
        setComment(e.target.value);
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if(!price || isNaN(Number(price))) {
            alert("Please enter a valid number for the price.");
            return;
        }
        alert(`You have submitted a quote of $${price}`);
        onClose();
    };

    if(!isOpen) return null;
    return (
        <div className="popup-overlay">
          <div className="popup-content">
            <h2>Enter Your Price Quote</h2>
            <p>Please provide details for the request service.</p>
            
            {/* Price input form */}
            <form onSubmit={handleSubmit}>
              <div className="input-group">
                
                <label htmlFor="price">
                <img src="/src/assets/images/money.svg"/>
                <input
                  type="number"
                  id="price"
                  name="price"
                  min="5"
                  value={price}
                  onChange={handlePriceChange}
                  placeholder="Price (in USD)"
                  required
                  step="0.01"
                /></label>
              </div>

              <div className="input-group">
                
                <label htmlFor="comment">
                <img src="/src/assets/images/comment.svg"/>
                <input
                  type="text"
                  id="comment"
                  name="comment"
                  minLength={5}
                  value={comment}
                  placeholder="Enter a comment..."
                  onChange={handleCommentChange}
                /></label>
              </div>

              <div className="buttons">
              <button type="submit" className="btn btn-primary">Submit Quote</button>
              <a className="btn btn-danger" onClick={onClose}>Close</a> 
              </div>

            </form>
            

          </div>
        </div>
      );
};

export default QuotePopup;
