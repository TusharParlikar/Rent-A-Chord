import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Cart.css";

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/login");
          return;
        }

        const response = await axios.get("http://localhost:5000/api/purchases", {
          headers: { "x-auth-token": token },
        });

        setCart(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching cart:", err);
        setError("Failed to load cart. Please try again later.");
        setLoading(false);
      }
    };

    fetchCart();
  }, [navigate]);

  const handleRemoveItem = async (itemId) => {
    const confirmRemove = window.confirm(
      "Are you sure you want to remove this item from your cart?"
    );
    if (!confirmRemove) return;

    try {
      const token = localStorage.getItem("token");

      await axios.delete(`http://localhost:5000/api/purchases/${itemId}`, {
        headers: { "x-auth-token": token },
      });

      // Update the cart state after removing the item
      setCart((prevCart) => prevCart.filter((item) => item._id !== itemId));
    } catch (err) {
      console.error("Error removing item:", err);
      alert("Failed to remove item. Please try again.");
    }
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert("Your cart is empty. Add items before proceeding to checkout.");
      return;
    }
    navigate("/payment"); // Redirect to the payment page
  };

  if (loading) {
    return (
      <div className="cart-container">
        <h2>Loading your cart...</h2>
        <div className="spinner"></div> {/* Add a spinner for better UX */}
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h2>Your Shopping Cart</h2>

      {error && <p className="error-message">{error}</p>}

      {cart.length === 0 ? (
        <div className="empty-cart">
          <p>Your cart is empty.</p>
          <button onClick={() => navigate("/")} className="continue-shopping">
            Continue Shopping
          </button>
        </div>
      ) : (
        <>
          <div className="cart-items">
            {cart.map((item) => (
              <div key={item._id} className="cart-item">
                <h3>{item.itemName}</h3>
                <p>Price: ₹{item.price}</p>
                {item.type === "rent" && item.days && (
                  <p>Rental Period: {item.days} days</p>
                )}
                <p>Type: {item.type || "purchase"}</p>
                <p>Date: {new Date(item.date).toLocaleDateString()}</p>
                <button
                  className="remove-btn"
                  onClick={() => handleRemoveItem(item._id)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <p className="total">
              Total: ₹
              {cart.reduce((total, item) => total + (item.price || 0), 0)}
            </p>
            <div className="cart-actions">
              <button
                onClick={() => navigate("/")}
                className="continue-shopping"
              >
                Continue Shopping
              </button>
              <button className="checkout-btn" onClick={handleCheckout}>
                Checkout
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
