import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Sppiner = ({ path = "login" }) => {
  const [count, setCount] = useState(3);
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prevValue) => --prevValue);
      if (count === 0) {
        navigate(`${path}`, { state: { from: location.pathname } });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [count, navigate, path, location]);
  return (
    <>
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <h1>Redirecting in {count} seconds</h1>
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    </>
  );
};

export default Sppiner;
