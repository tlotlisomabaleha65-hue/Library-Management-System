import React from 'react';
import { NavLink } from 'react-router-dom';

// Navbar component provides navigation links and displays current user session
function Navbar({ currentUser, onLogout }) {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="nav-brand">
          📚 Community Library System
        </div>

        <ul className="nav-links">
          <li>
            <NavLink to="/" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink to="/books" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              Books
            </NavLink>
          </li>
          <li>
            <NavLink to="/transactions" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              Transactions
            </NavLink>
          </li>
          <li>
            <NavLink to="/users" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              Users & Login
            </NavLink>
          </li>
        </ul>

        <div className="nav-user-info">
          {currentUser ? (
            <>
              <span>👤 <strong>{currentUser.name}</strong> ({currentUser.role})</span>
              <button className="logout-btn" onClick={onLogout}>Logout</button>
            </>
          ) : (
            <span>Not logged in</span>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
