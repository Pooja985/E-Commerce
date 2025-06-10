import { useEffect, useState } from "react";
import { useAuth } from "../../context/auth";
import { Outlet } from "react-router-dom";
import axios from "axios";
import Sppiner from "../Sppiner";

export default function AdminRoute() {
  const [ok, setOk] = useState(false);
  const [auth] = useAuth(); // No need to use setAuth

  useEffect(() => {
    const authCheck = async () => {
      try {
        if (!auth?.token) {
          console.log("No token found, user not authenticated");
          setOk(false);
          return;
        }

        const res = await axios.get(`/api/v1/auth/admin-auth`, {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        });

        console.log("Auth Check Response:", res.data);

        setOk(res.data.ok);
      } catch (error) {
        console.error(
          "Authentication failed:",
          error.response?.data || error.message
        );
        setOk(false);
      }
    };

    if (auth?.token) authCheck();
  }, [auth?.token]);

  return ok ? <Outlet /> : <Sppiner path="/" />;
}
