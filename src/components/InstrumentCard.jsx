// src/components/InstrumentCard.jsx
import { Link } from 'react-router-dom';
import './InstrumentCard.css';

const InstrumentCard = ({ instrument }) => {
  return (
    <div className="card">
      <img src={instrument.image} alt={instrument.name} />
      <h3>{instrument.name}</h3>
      <p>₹{instrument.pricePerDay} / day</p>
      <Link to={`/instrument/${instrument.id}`} className="btn">View</Link>
    </div>
  );
};

export default InstrumentCard;
