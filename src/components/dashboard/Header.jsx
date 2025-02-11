import React from "react";
import { FaBell, FaUserCircle } from "react-icons/fa";

const Header = () => {
  return (
    <nav className="navbar navbar-light">
      <h4>Welcome, User</h4>
      <div className="d-flex align-items-center">
        {/* <FaBell className="me-3" size={20} /> */}
        <FaUserCircle size={25} />
      </div>
    </nav>
  );
};

export default Header;
