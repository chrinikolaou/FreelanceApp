import { ChangeEvent, FormEvent, useState } from "react";
import '/src/assets/style/quotepopup.css';

interface RatingPopupProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (completedJobId: number, comment: string, rate: number) => void;
    completedJobId: number;
  }

const RatingPopup: React.FC<RatingPopupProps> = ({ isOpen, onClose, onSubmit, completedJobId }: RatingPopupProps) => {
    const [rate, setRate] = useState<number>(0);
    const [comment, setComment] = useState<string>('');

    const handleRatingChange = (e: ChangeEvent<HTMLInputElement>) => {
        setRate(Number(e.target.value)); // <- must convert to number
    };

    const handleCommentChange = (e: ChangeEvent<HTMLInputElement>) => {
        setComment(e.target.value);
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault(); // <- prevent page reload
      onSubmit(completedJobId, comment, rate);
      onClose(); 
    };

    if (!isOpen) return null;

    return (
        <div className="popup-overlay">
          <div className="popup-content">
            <h2>Enter Your Rating</h2>
            <p>Please provide a rating for the freelancer.</p>
            
            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <label htmlFor="rating">
                  <img src="/src/assets/images/star.svg" />
                  <input
                    type="number"
                    id="rating"
                    name="rating"
                    min="0"
                    max="5"
                    value={rate}
                    onChange={handleRatingChange}
                    placeholder="Price (in USD)"
                    required
                    step="0.5"
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
                <button type="submit" className="btn btn-primary">Submit Rating</button>
                <a className="btn btn-danger" onClick={onClose}>Close</a> 
              </div>
            </form>
          </div>
        </div>
      );
};

export default RatingPopup;
