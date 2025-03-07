import React from 'react';
import './Navbar.css';
import logo from '../images/logo.png';

const Navbar = ({ isLoggedIn, onLogout }) => {
  // Function to handle navigation using window.location
  const navigate = (path) => {
    window.location.href = path;
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <img src={logo} alt="Agriculture Logo" style={{ height: '30px' }} />
      </div>
      <ul className="nav-links">
        {isLoggedIn ? (
          <>
            <li><a href="/weatherForecast">Weather Forecast</a></li>
            <li><a href="/expenseTrackerDashboard">Expense Tracker</a></li>
            <li><a href="/expertConsult">Expert Consult</a></li>
            <li><a href="/Crophealth">Crop Doctor</a></li>
            <li><a href="/rentalPage">RentalPage</a></li>
            <li><a href="/notifications">Notifications</a></li>
            <li><a href="/about">About</a></li>
          </>
        ) : (
          <>
            <li><a href="/">Home</a></li>
            <li><a href="/services">Services</a></li>
            <li><a href="/about">About</a></li>
          </>
        )}
      </ul>
      <div className="auth-buttons">
        {isLoggedIn ? (
          <button className="logout-btn" onClick={onLogout}>LogOut</button>
        ) : (
          <>
            {/* Use the navigate function on button clicks */}
            <button className="login-btn" onClick={() => navigate('/Login')}>Login</button>
            <button className="signup-btn" onClick={() => navigate('/choose')}>Sign Up</button>
          </>
        )}
      </div>
    </nav>
  );
};
export default Navbar;
