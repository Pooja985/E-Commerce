import React from "react";
import Layout from "../../components/Layout/Layout";
import UserMenu from "../../components/Layout/UserMenu";
import { useAuth } from "../../context/auth";

const Dashboard = () => {
  const [auth] = useAuth();

  return (
    <Layout title={"Dashboard - ECommerce App"}>
      <div className="container-fluid py-4 px-3">
        <div className="row">
          {/* Sidebar */}
          <div className="col-md-3 mb-3">
            <UserMenu />
          </div>

          {/* User Details */}
          <div className="col-md-9">
            <div className="card shadow-sm p-4">
              <h4 className="mb-3 text-primary">User Information</h4>
              <ul className="list-group list-group-flush">
                <li className="list-group-item">
                  <strong>Name: </strong> {auth?.user?.name}
                </li>
                <li className="list-group-item">
                  <strong>Email: </strong> {auth?.user?.email}
                </li>
                <li className="list-group-item">
                  <strong>Address: </strong> {auth?.user?.address}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
