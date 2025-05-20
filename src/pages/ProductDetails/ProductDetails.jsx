import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import instruments from "../../data/instruments";
import axios from "axios";
import "./ProductDetails.css";

const ProductDetails = () => {
  const { id } = useParams(); // Get the instrument ID from the route
  const navigate = useNavigate();
  const [rentDays, setRentDays] = useState(1);
  const [option, setOption] = useState(""); // "rent" or "buy"

  // Find the instrument based on the ID
  const instrument = instruments.find((item) => item.id.toString() === id);

  if (!instrument) {
    return <h2>Instrument not found</h2>;
  }

  console.log("Instrument details:", instrument); // Log the instrument object

  const handleRentNow = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to rent an instrument.");
      navigate("/login");
      return;
    }

    const newItem = {
      itemName: instrument.name,
      price: instrument.pricePerDay * rentDays,
      days: rentDays,
      type: "rent",
    };

    try {
      await axios.post("http://localhost:5000/api/purchases", newItem, {
        headers: { "x-auth-token": token },
      });
      alert(`${instrument.name} has been added to your cart for rent!`);
      navigate("/cart");
    } catch (err) {
      console.error("Error renting instrument:", err);
      alert("Failed to rent the instrument. Please try again.");
    }
  };

  const handleBuyNow = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to buy an instrument.");
      navigate("/login");
      return;
    }

    const newItem = {
      itemName: instrument.name,
      price: instrument.buyPrice, // Ensure this is not undefined
      days: null, // For purchases, days should be null
      type: "buy",
    };

    try {
      const response = await axios.post("http://localhost:5000/api/purchases", newItem, {
        headers: { "x-auth-token": token },
      });

      alert(`${instrument.name} has been added to your cart for purchase!`);
      navigate("/cart"); // Redirect to the cart page
    } catch (err) {
      console.error("Error buying instrument:", err);
      alert("Failed to buy the instrument. Please try again.");
    }
  };

  return (
    <div className="product-details-container">
      <img src={instrument.image} alt={instrument.name} />
      <h2>{instrument.name}</h2>
      <p>Price per day: ₹{instrument.pricePerDay}</p>
      <p>Buy Price: ₹{instrument.buyPrice}</p>

      <div className="options">
        <button
          className={`option-toggle ${option === "rent" ? "active" : ""}`}
          onClick={() => setOption("rent")}
        >
          Rent
        </button>
        <button
          className={`option-toggle ${option === "buy" ? "active" : ""}`}
          onClick={() => setOption("buy")}
        >
          Buy
        </button>
      </div>

      {option === "rent" && (
        <div className="rent-options">
          <p>Rental Period:</p>
          <div className="counter">
            <button onClick={() => setRentDays(Math.max(1, rentDays - 1))}>
              -
            </button>
            <span>{rentDays} days</span>
            <button onClick={() => setRentDays(rentDays + 1)}>+</button>
          </div>
          <button className="rent-now-btn" onClick={handleRentNow}>
            Rent Now
          </button>
        </div>
      )}

      {option === "buy" && (
        <button className="buy-now-btn" onClick={handleBuyNow}>
          Buy Now
        </button>
      )}

      <button className="back-btn" onClick={() => navigate("/")}>
        Back to Home
      </button>
    </div>
  );
};

export default ProductDetails;
