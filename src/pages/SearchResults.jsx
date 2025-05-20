import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import instruments from '../data/instruments';
import './SearchResults.css';

const SearchResults = () => {
  const { searchTerm } = useParams();
  const navigate = useNavigate();
  const [buyOrRent, setBuyOrRent] = useState('rent');
  const [rentDays, setRentDays] = useState(1);
  
  // Find the instrument based on search term
  const instrument = instruments.find(
    (item) => item.name.toLowerCase() === searchTerm.toLowerCase()
  );

  // Calculate total price for rental
  const calculateTotalPrice = () => {
    return instrument.pricePerDay * rentDays;
  };

  // Add to bag handler - this is the key function
  const handleAddToBag = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to add items to your bag.");
      navigate("/login");
      return;
    }

    // First log the instrument to see available properties
    console.log("Instrument data:", instrument);

    // Create the new item object with the correct price property
    const newItem = {
      itemName: instrument.name,
      // Fix the price calculation based on your data model
      price: buyOrRent === "rent" ? calculateTotalPrice() : instrument.buyPrice || instrument.pricePerDay * 20, // Fallback calculation
      days: buyOrRent === "rent" ? rentDays : null,
      type: buyOrRent // "rent" or "buy"
    };

    try {
      console.log("Sending to backend:", newItem);
      
      // Send the purchase to the backend
      const response = await axios.post("http://localhost:5000/api/purchases", newItem, {
        headers: { "x-auth-token": token },
      });
      
      console.log("Backend response:", response.data);

      alert(`${instrument.name} has been added to your bag!`);
      navigate("/cart");
    } catch (err) {
      console.error("Error adding item to bag:", err);
      alert("Failed to add item to bag. Please try again.");
    }
  };

  if (!instrument) {
    return <h1>Item not found</h1>;
  }

  return (
    <div className="search-results-container">
      <div className="instrument-details">
        <h2>{instrument.name}</h2>
        <img src={instrument.image} alt={instrument.name} />
        <p>{instrument.description}</p>
      </div>

      <div className="pricing-options">
        <div className="option-toggle">
          <button 
            className={buyOrRent === "rent" ? "active" : ""} 
            onClick={() => setBuyOrRent("rent")}
          >
            Rent
          </button>
          <button 
            className={buyOrRent === "buy" ? "active" : ""} 
            onClick={() => setBuyOrRent("buy")}
          >
            Buy
          </button>
        </div>
        
        {buyOrRent === "rent" && (
          <div className="rental-days">
            <label>Rental Period:</label>
            <div className="days-selector">
              <button onClick={() => setRentDays(Math.max(1, rentDays - 1))}>-</button>
              <span>{rentDays} days</span>
              <button onClick={() => setRentDays(rentDays + 1)}>+</button>
            </div>
          </div>
        )}
        
        <div className="price-display">
          {buyOrRent === "rent" ? (
            <p>Rental Price: ${calculateTotalPrice()}</p>
          ) : (
            <p>Purchase Price: ${instrument.price}</p>
          )}
        </div>
        
        {/* THIS BUTTON IS CRUCIAL - it must call handleAddToBag */}
        <button onClick={handleAddToBag} className="add-to-bag-btn">
          {buyOrRent === "rent" ? "Rent Now" : "Buy Now"}
        </button>
      </div>
    </div>
  );
};

export default SearchResults;