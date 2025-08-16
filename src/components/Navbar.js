import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiLogOut } from 'react-icons/fi';
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();

  const userdata = JSON.parse(localStorage.getItem("userDataUser"));

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userDataUser')
    navigate("/");
  };

  return (
    <nav className="navbar">
      <h2 style={{ marginLeft: '815px', marginTop: "30px" }}>Logistics Supply Chain</h2>
      <ul>
        <li style={{marginTop: "15px"}}>
          <Link to="/document">Document</Link>
        </li>
        {userdata.roles !== 'ROLE_Verifier' && (
        <li style={{marginTop: "15px"}}>
          <Link to="/fileupload">File Upload</Link>
        </li>
        )}
        <li style={{marginTop: "15px"}}>
          <Link to="/verifyupload">Verify File</Link>
        </li>
        {userdata.roles === 'ROLE_Admin' && (
         <li style={{marginTop: "15px"}}>
          <Link to="/updatefile">Update File</Link>
        </li>
        )}
        {userdata.roles === 'ROLE_Admin' && (
        <li style={{marginTop: "15px"}}>
          <Link to="/userform">Users</Link>
        </li>
        )}
        <li className="logout-btn-admin" onClick={handleLogout}>
          <FiLogOut size={20} /> Logout
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
