import React from "react";
import { useNavigate } from "react-router-dom";
import instruments from "../data/instruments";
import "./Home.css";

const Home = () => {
  const navigate = useNavigate();

  const handleViewDetails = (instrumentId) => {
    navigate(`/instrument/${instrumentId}`);
  };

  return (
    <div className="home-container">
      <section className="instruments-section">
        <h2 className="cyber-heading">Available for Rent</h2>
        <div className="instrument-list">
          {instruments.map((item) => (
            <div key={item.id} className="instrument-card">
              <img src={item.image} alt={item.name} />
              <h3>{item.name}</h3>
              <p>₹{item.pricePerDay}/day</p>
              <p>Buy Price: ₹{item.buyPrice}</p>
              <button
                className="view-details-btn"
                onClick={() => handleViewDetails(item.id)}
              >
                Buy or Rent
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
