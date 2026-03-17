import React from "react";
import { Container } from "react-bootstrap";
import { Route, Routes } from "react-router-dom";

import MainHeader from "./components/MainHeader";
import { AdminRoute, PrivateRoute, SellerRoute } from "./components/RouteGuards";
import ApplySeller from "./screens/ApplySeller";
import ChatbotScreen from "./screens/ChatbotScreen";
import DetailScreen from "./screens/DetailScreen";
import HomeScreen from "./screens/HomeScreen";
import SellerDashboard from "./screens/SellerDashboard";
import SignIn from "./screens/SignIn";
import SignUp from "./screens/SignUp";
import SubscriptionList from "./screens/SubscriptionList";
import SubscriptionScreen from "./screens/SubscriptionScreen";
import UserProfile from "./screens/UserProfile";
import UserScreen from "./screens/UserScreen";

export default function App() {
  return (
    <>
      <MainHeader />
      <Container className="pb-4">
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route
            path="/service/:id"
            element={
              <PrivateRoute>
                <DetailScreen />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <UserProfile />
              </PrivateRoute>
            }
          />
          <Route
            path="/apply-seller"
            element={
              <PrivateRoute>
                <ApplySeller />
              </PrivateRoute>
            }
          />
          <Route
            path="/seller/dashboard"
            element={
              <SellerRoute>
                <SellerDashboard />
              </SellerRoute>
            }
          />
          <Route
            path="/subscription"
            element={
              <PrivateRoute>
                <SubscriptionScreen />
              </PrivateRoute>
            }
          />
          <Route
            path="/chatbot"
            element={
              <PrivateRoute>
                <ChatbotScreen />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <AdminRoute>
                <UserScreen />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/subscriptions"
            element={
              <AdminRoute>
                <SubscriptionList />
              </AdminRoute>
            }
          />
        </Routes>
      </Container>
    </>
  );
}
