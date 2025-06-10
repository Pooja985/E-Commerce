import React, { useEffect, useState } from "react";
import Layout from "../components/Layout/Layout";
import { useAuth } from "../context/auth";
import { useCart } from "../context/cart";
import { useNavigate } from "react-router-dom";
import DropIn from "braintree-web-drop-in-react";
import axios from "axios";
import toast from "react-hot-toast";
import "../styles/CartStyles.css";

const CartPage = () => {
  const [auth] = useAuth();
  const [cart, setCart] = useCart();
  const [clientToken, setClientToken] = useState("");
  const [instance, setInstance] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const totalPrice = () => {
    try {
      let total = 0;
      cart?.forEach((item) => {
        total += item.price;
      });
      return total.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = (pid) => {
    try {
      let myCart = [...cart];
      let index = myCart.findIndex((item) => item._id === pid);
      myCart.splice(index, 1);
      setCart(myCart);
      localStorage.setItem("Cart", JSON.stringify(myCart));
    } catch (error) {
      console.error(error);
    }
  };

  const getToken = async () => {
    try {
      const { data } = await axios.get(`/api/v1/product/braintree/token`);
      setClientToken(data?.clientToken);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getToken();
  }, [auth?.token]);

  const handlePayment = async () => {
    try {
      setLoading(true);
      const { nonce } = await instance.requestPaymentMethod();
      const { data } = await axios.post(`/api/v1/product/braintree/payment`, {
        nonce,
        cart,
      });
      setLoading(false);
      localStorage.removeItem("Cart");
      setCart([]);
      navigate("/dashboard/user/orders");
      toast.success("Payment Successful");
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container py-4">
        <div className="row mb-4">
          <div className="col-12 text-center">
            <h2>Hello {auth?.token && auth?.user?.name}</h2>
            <p className="lead">
              {cart?.length > 0
                ? `You have ${cart.length} item(s) in your cart`
                : "Your cart is empty"}
            </p>
            {!auth?.token && <p>Please login to proceed with checkout.</p>}
          </div>
        </div>

        <div className="row">
          {/* Cart Items */}
          <div className="col-lg-8">
            {cart?.map((p) => (
              <div key={p._id} className="card mb-3 shadow-sm border-0">
                <div className="row g-0">
                  <div className="col-md-4">
                    <img
                      src={`/api/v1/product/product-photo/${p._id}`}
                      alt={p.name}
                      className="img-fluid rounded-start"
                      style={{ height: "100%", objectFit: "cover" }}
                    />
                  </div>
                  <div className="col-md-8">
                    <div className="card-body">
                      <h5 className="card-title">{p.name}</h5>
                      <p className="card-text text-muted">
                        {p.description.substring(0, 100)}...
                      </p>
                      <p className="fw-bold">Price: ${p.price}</p>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(p._id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Checkout Summary */}
          <div className="col-lg-4">
            <div className="card p-3 shadow-sm sticky-top">
              <h4 className="mb-3">Cart Summary</h4>
              <hr />
              <p className="mb-1">Items: {cart?.length}</p>
              <h5>Total: {totalPrice()}</h5>

              <hr />

              {/* Address Section */}
              {auth?.user?.address ? (
                <div className="mb-3">
                  <h6>Current Address</h6>
                  <p>{auth?.user?.address}</p>
                  <button
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => navigate("/dashboard/user/profile")}
                  >
                    Update Address
                  </button>
                </div>
              ) : (
                <div className="mb-3">
                  {auth?.token ? (
                    <button
                      className="btn btn-outline-warning btn-sm"
                      onClick={() => navigate("/dashboard/user/profile")}
                    >
                      Add Address
                    </button>
                  ) : (
                    <button
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => navigate("/login")}
                    >
                      Login to Checkout
                    </button>
                  )}
                </div>
              )}

              {/* Payment Section */}
              <div>
                {clientToken && auth?.token && (
                  <>
                    <DropIn
                      options={{
                        authorization: clientToken,
                        paypal: { flow: "vault" },
                      }}
                      onInstance={(instance) => setInstance(instance)}
                    />
                    <button
                      className="btn btn-success w-100"
                      onClick={handlePayment}
                      disabled={loading || !instance || cart?.length === 0}
                    >
                      {loading ? "Processing..." : "Make Payment"}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CartPage;
