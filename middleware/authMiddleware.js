import JWT from "jsonwebtoken";
import userModel from "../model/userModel.js";

export const requireSignIn = async (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      return res.status(401).json({ message: "No token provided" });
    }
    const token = req.headers.authorization.split(" ")[1]; // Remove "Bearer "
    const decode = JWT.verify(token, process.env.JWT_SECRET);
    req.user = decode;
    next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized" });
  }
};

export const isAdmin = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.role != "1") {
      return res
        .status(403)
        .json({ message: "Forbidden: Admin access required" });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: "Server error in isAdmin" });
  }
};
