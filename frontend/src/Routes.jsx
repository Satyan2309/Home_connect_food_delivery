import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import ProtectedRoute from "components/ProtectedRoute";
// Add your imports here
import UserRegistrationLogin from "pages/user-registration-login";
import MealDiscoveryBrowse from "pages/meal-discovery-browse";
import ChefProfileMenuManagement from "pages/chef-profile-menu-management";
import ChefProfile from "pages/chef-profile";
import UserProfileSettings from "pages/user-profile-settings";
import OrderTrackingHistory from "pages/order-tracking-history";
import ShoppingCartCheckout from "pages/shopping-cart-checkout";
import MealDetails from "pages/meal-details";
import NotFound from "pages/NotFound";

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your routes here */}
        <Route path="/" element={<MealDiscoveryBrowse />} />
        <Route path="/user-registration-login" element={<UserRegistrationLogin />} />
        <Route path="/meal-discovery-browse" element={<MealDiscoveryBrowse />} />
        <Route path="/chef-profile-menu-management" element={<ProtectedRoute><ChefProfileMenuManagement /></ProtectedRoute>} />
        <Route path="/chef-profile/:id" element={<ProtectedRoute><ChefProfile /></ProtectedRoute>} />
        <Route path="/user-profile-settings" element={<UserProfileSettings />} />
        <Route path="/order-tracking-history" element={<OrderTrackingHistory />} />
        <Route path="/shopping-cart-checkout" element={<ProtectedRoute><ShoppingCartCheckout /></ProtectedRoute>} />
        <Route path="/meal-details/:id" element={<MealDetails />} />
        {/* Removed connection-check route */}
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;