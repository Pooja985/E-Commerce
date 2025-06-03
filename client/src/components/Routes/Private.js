import { useEffect, useState } from "react";
import { useAuth } from "../../context/auth";
import { Outlet } from "react-router-dom";
import axios from "axios";
import Sppiner from "../Sppiner";

export default function PrivateRoute() {
  const [ok, setOk] = useState(false);
  const [auth] = useAuth(); // No need to use setAuth

  useEffect(() => {
    const authCheck = async () => {
      try {
        if (!auth?.token) {
          setOk(false);
          return;
        }

        const res = await axios.get(
          `${process.env.REACT_APP_API}/api/v1/auth/user-auth`,
          {
            headers: {
              Authorization: `Bearer ${auth.token}`, // Ensure "Bearer " is included
            },
          }
        );

        console.log("Auth Check Response:", res.data);

        if (res.data.ok) {
          setOk(true);
        } else {
          setOk(false);
        }
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

  return ok ? <Outlet /> : <Sppiner />;
}
