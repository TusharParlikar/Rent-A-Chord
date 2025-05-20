// src/components/Navbar.jsx
import { Link, useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import './Navbar.css';

const Navbar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);

  const navigate = useNavigate();

  // Check login status and get user data
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      // Get user data from localStorage if available
      const user = JSON.parse(localStorage.getItem('userData'));
      if (user) {
        setUserData(user);
      }
    } else {
      setIsLoggedIn(false);
      setUserData(null);
    }
  }, []);

  useEffect(() => {
    document.body.className = theme;
    localStorage.setItem('theme', theme);
  }, [theme]);

  const instruments = ['Acoustic Guitar', 'Drum Set', 'Keyboard'];

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value) {
      const filteredSuggestions = instruments.filter((instrument) =>
        instrument.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion);
    setSuggestions([]);
  };

  const handleSearch = () => {
    if (instruments.some((instrument) => instrument.toLowerCase() === searchTerm.toLowerCase())) {
      navigate(`/search/${searchTerm}`);
    } else {
      navigate('/search/not-found');
    }
  };

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    setIsLoggedIn(false);
    setUserData(null);
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="brand">🎸 Rent-A-Chord</Link>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search instruments..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
        {suggestions.length > 0 && (
          <ul className="suggestions">
            {suggestions.map((suggestion, index) => (
              <li key={index} onClick={() => handleSuggestionClick(suggestion)}>
                {suggestion}
              </li>
            ))}
          </ul>
        )}
        <button className="search-button" onClick={handleSearch}>Search</button>
      </div>

      {/* Navigation Links */}
      <div className="nav-links">
        {isLoggedIn ? (
          <>
            <Link to="/cart" className="bag-link">🛍️ Cart</Link>
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>

      {/* Circular Profile Dropdown */}
      <div className="profile-dropdown">
        <div className="profile-circle" onClick={toggleDropdown}>
          <span>{userData ? userData.username.charAt(0).toUpperCase() : 'G'}</span>
        </div>
        {dropdownOpen && (
          <div className="dropdown-menu">
            <p className="profile-name">{userData ? userData.username : 'Guest'}</p>
            {isLoggedIn ? (
              <>
                <Link to="/cart" className="dropdown-item">My Cart</Link>
                <button onClick={handleLogout} className="dropdown-item">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="dropdown-item">Login</Link>
                <Link to="/register" className="dropdown-item">Register</Link>
              </>
            )}
          </div>
        )}
      </div>

      {/* Theme Toggle Button */}
      <button className="theme-toggle-btn" onClick={toggleTheme}>
        {theme === 'light' ? '🌙' : '☀️'}
      </button>
    </nav>
  );
};

export default Navbar;
