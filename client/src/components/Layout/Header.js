import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Badge } from "antd";
import { useAuth } from "../../context/auth";
import { useCart } from "../../context/cart";
import { useSearch } from "../../context/search"; // ✅ added
import useCategory from "../../hooks/useCategory";
import axios from "axios"; // ✅ added

const Header = () => {
  const [auth, setAuth] = useAuth();
  const [cart] = useCart();
  const [values, setValues] = useSearch(); // ✅ added
  const [keyword, setKeyword] = useState(""); // ✅ added
  const navigate = useNavigate();
  const categories = useCategory();

  const handleLogout = () => {
    setAuth({ ...auth, user: null, token: "" });
    localStorage.removeItem("auth");
    toast.success("Logout Successfully");
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.get(
        `/api/v1/product/search-product/${keyword}`
      );
      setValues({ keyword, result: data?.result });
      navigate("/search");
    } catch (error) {
      console.error("Search failed:", error);
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm sticky-top">
      <div className="container-fluid">
        {/* Logo */}
        <Link to="/" className="navbar-brand fw-bold d-flex align-items-center">
          🛒 <span className="ms-2">ECOMMERCE APP</span>
        </Link>

        {/* Mobile Toggle Button */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
          aria-controls="navbarContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navbar Items */}
        <div className="collapse navbar-collapse" id="navbarContent">
          <ul className="navbar-nav ms-auto align-items-lg-center w-100">
            {/* Search Bar */}
            <form
              className="d-flex align-items-center ms-auto my-2 my-lg-0"
              onSubmit={handleSearch}
            >
              <input
                type="text"
                className="form-control"
                placeholder="Search"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                style={{ maxWidth: "200px" }}
              />
              <button className="btn btn-outline-success ms-2" type="submit">
                Search
              </button>
            </form>

            {/* Home */}
            <li className="nav-item">
              <NavLink to="/" className="nav-link text-center">
                Home
              </NavLink>
            </li>

            {/* Categories Dropdown */}
            <li className="nav-item dropdown text-center">
              <Link
                className="nav-link dropdown-toggle"
                to="/categories"
                role="button"
                data-bs-toggle="dropdown"
              >
                Categories
              </Link>
              <ul className="dropdown-menu">
                <li>
                  <Link className="dropdown-item" to="/categories">
                    All Categories
                  </Link>
                </li>
                {categories?.map((c) => (
                  <li key={c.slug}>
                    <Link className="dropdown-item" to={`/category/${c.slug}`}>
                      {c.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>

            {/* Auth */}
            {!auth?.user ? (
              <>
                <li className="nav-item text-center">
                  <NavLink to="/login" className="nav-link">
                    Login
                  </NavLink>
                </li>
                <li className="nav-item text-center">
                  <NavLink to="/register" className="nav-link">
                    Register
                  </NavLink>
                </li>
              </>
            ) : (
              <li className="nav-item dropdown text-center">
                <NavLink
                  className="nav-link dropdown-toggle"
                  id="userDropdown"
                  data-bs-toggle="dropdown"
                >
                  {auth?.user?.name}
                </NavLink>
                <ul className="dropdown-menu">
                  <li>
                    <NavLink
                      to={`/dashboard/${
                        auth?.user?.role === 1 ? "admin" : "user"
                      }`}
                      className="dropdown-item"
                    >
                      Dashboard
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/login"
                      onClick={handleLogout}
                      className="dropdown-item"
                    >
                      Logout
                    </NavLink>
                  </li>
                </ul>
              </li>
            )}

            {/* Cart */}
            <li className="nav-item text-center">
              <NavLink to="/cart" className="nav-link position-relative">
                <Badge
                  count={cart?.length}
                  showZero
                  offset={[5, -3]}
                  style={{ backgroundColor: "#dc3545" }}
                >
                  <span className="fw-semibold">Cart</span>
                </Badge>
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
