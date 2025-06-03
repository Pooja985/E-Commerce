import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout";
import UserMenu from "../../components/Layout/UserMenu";
import axios from "axios";
import { useAuth } from "../../context/auth";
import moment from "moment";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [auth] = useAuth();

  const getOrders = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/auth/orders`
      );
      setOrders(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (auth?.token) getOrders();
  }, [auth?.token]);

  return (
    <Layout title={"Dashboard - Orders"}>
      <div className="container-fluid py-3 px-4">
        <div className="row">
          <div className="col-md-3 mb-3">
            <UserMenu />
          </div>

          <div className="col-md-9">
            <h2 className="text-center mb-4">Your Orders</h2>

            {orders?.map((order, index) => (
              <div
                className="card shadow-sm mb-4 border-0"
                key={order._id || index}
              >
                <div className="card-header bg-light fw-semibold">
                  <span className="me-3">Order #{index + 1}</span>
                  <span className="badge bg-info text-dark">
                    {order.status}
                  </span>
                </div>

                <div className="card-body p-3">
                  <table className="table table-bordered mb-3">
                    <thead className="table-light">
                      <tr>
                        <th>Status</th>
                        <th>Buyer</th>
                        <th>Date</th>
                        <th>Payment</th>
                        <th>Products</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>{order.status}</td>
                        <td>{order?.buyer?.name}</td>
                        <td>{moment(order.createdAt).fromNow()}</td>
                        <td>
                          {order?.payment?.success ? "✅ Success" : "❌ Failed"}
                        </td>
                        <td>{order?.products?.length}</td>
                      </tr>
                    </tbody>
                  </table>

                  <div className="row">
                    {order?.products?.map((product, idx) => (
                      <div className="col-md-6 mb-3" key={product._id || idx}>
                        <div className="card h-100">
                          <div className="row g-0">
                            <div className="col-md-4">
                              <img
                                src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${product._id}`}
                                className="img-fluid rounded-start"
                                alt={product.name}
                              />
                            </div>
                            <div className="col-md-8">
                              <div className="card-body">
                                <h5 className="card-title">{product.name}</h5>
                                <p className="card-text">
                                  {product.description?.substring(0, 60)}...
                                </p>
                                <p className="card-text fw-semibold">
                                  Price: ${product.price}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}

            {orders?.length === 0 && (
              <p className="text-center text-muted">No orders found.</p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Orders;
