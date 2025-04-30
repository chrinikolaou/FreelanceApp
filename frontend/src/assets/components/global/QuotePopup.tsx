import { ChangeEvent, FormEvent, useState } from "react";
import '/src/assets/style/quotepopup.css';

interface QuotePopupProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (comment: string, price: number) => void;
}

const QuotePopup: React.FC<QuotePopupProps> = ({ isOpen, onClose, onSubmit }: QuotePopupProps) => {
    const [price, setPrice] = useState<number>(5);
    const [comment, setComment] = useState<string>('');

    const handlePriceChange = (e: ChangeEvent<HTMLInputElement>) => {
        setPrice(Number(e.target.value)); // <- must convert to number
    };

    const handleCommentChange = (e: ChangeEvent<HTMLInputElement>) => {
        setComment(e.target.value);
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault(); // <- prevent page reload
      onSubmit(comment, price);
      onClose(); 
    };

    if (!isOpen) return null;

    return (
        <div className="popup-overlay">
          <div className="popup-content">
            <h2>Enter Your Price Quote</h2>
            <p>Please provide details for the requested service.</p>
            
            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <label htmlFor="price">
                  <img src="/src/assets/images/money.svg" />
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
                  />
                </label>
              </div>

              <div className="input-group">
                <label htmlFor="comment">
                  <img src="/src/assets/images/comment.svg" />
                  <input
                    type="text"
                    id="comment"
                    name="comment"
                    minLength={5}
                    value={comment}
                    placeholder="Enter a comment..."
                    onChange={handleCommentChange}
                  />
                </label>
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
