import React from "react";
import { NavLink } from "react-router-dom";

const UserMenu = () => {
  return (
    <aside className="text-center">
      <div className="list-group">
        <h4 className="mb-3">User Panel</h4>

        <NavLink
          to="/dashboard/user/profile"
          className={({ isActive }) =>
            `list-group-item list-group-item-action ${isActive ? "active" : ""}`
          }
        >
          Profile
        </NavLink>
        <NavLink
          to="/dashboard/user/orders"
          className={({ isActive }) =>
            `list-group-item list-group-item-action ${isActive ? "active" : ""}`
          }
        >
          Orders
        </NavLink>
      </div>
    </aside>
  );
};

export default UserMenu;
