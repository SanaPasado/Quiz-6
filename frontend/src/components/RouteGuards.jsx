import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export function PrivateRoute({ children }) {
  const { userInfo } = useSelector((state) => state.userState);
  return userInfo ? children : <Navigate to="/signin" replace />;
}

export function AdminRoute({ children }) {
  const { userInfo } = useSelector((state) => state.userState);
  return userInfo && userInfo.role === "Admin" ? children : <Navigate to="/" replace />;
}

export function SellerRoute({ children }) {
  const { userInfo } = useSelector((state) => state.userState);
  return userInfo && userInfo.role === "Seller" ? children : <Navigate to="/" replace />;
}
