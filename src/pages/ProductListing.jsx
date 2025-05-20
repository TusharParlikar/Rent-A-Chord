import React, { useState } from 'react';
import instruments from '../data/instruments';
import './ProductListing.css';

const ProductListing = () => {
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [availabilityFilter, setAvailabilityFilter] = useState('All');

  const filteredInstruments = instruments.filter((instrument) => {
    const matchesCategory =
      categoryFilter === 'All' || instrument.category === categoryFilter;
    const matchesAvailability =
      availabilityFilter === 'All' || instrument.availability === availabilityFilter;
    return matchesCategory && matchesAvailability;
  });

  return (
    <div className="product-listing">
      <h1>Product Listings</h1>

      {/* Filters */}
      <div className="filters">
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="All">All Categories</option>
          <option value="Guitar">Guitar</option>
          <option value="Drums">Drums</option>
          <option value="Piano">Piano</option>
        </select>

        <select
          value={availabilityFilter}
          onChange={(e) => setAvailabilityFilter(e.target.value)}
        >
          <option value="All">All Availability</option>
          <option value="in stock">In Stock</option>
          <option value="only for rent">Only for Rent</option>
          <option value="out of stock">Out of Stock</option>
        </select>
      </div>

      {/* Product Cards */}
      <div className="product-grid">
        {filteredInstruments.map((instrument) => (
          <div key={instrument.id} className="product-card">
            <img src={instrument.image} alt={instrument.name} />
            <h2>{instrument.name}</h2>
            <p>{instrument.description}</p>
            <p>Price: ₹{instrument.pricePerDay}/day</p>
            <p>Availability: {instrument.availability}</p>
            <button>View Details</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductListing;