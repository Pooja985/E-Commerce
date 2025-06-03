import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="footer bg-dark text-light py-3">
      <h5 className="text-center mb-2">All Rights Reserved &copy; 2025</h5>
      <p className="text-center">
        <Link to="/about" className="text-light mx-2">
          About
        </Link>
        |
        <Link to="/contact" className="text-light mx-2">
          Contact
        </Link>
        |
        <Link to="/policy" className="text-light mx-2">
          Policy
        </Link>
      </p>
    </footer>
  );
};

export default Footer;
