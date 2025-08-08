import React from "react";
import ReactDOM from "react-dom/client";
// Font Awesome CDN import
// Bootstrap CDN import
import { HashRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./redux/store";

import {
  Home,
  Product,
  Products,
  AboutPage,
  ContactPage,
  Cart,
  Login,
  Register,
  Checkout,
  PageNotFound,
  AICatalog,
  BlockchainDemo,
  ProductCardDemo,
} from "./pages";
import ScrollToTop from "./components/ScrollToTop";
import PageLoader from "./components/PageLoader";
import UserExperience from "./components/UserExperience";
import { Toaster } from "react-hot-toast";
import "./styles/theme.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <HashRouter>
    <ScrollToTop>
      <Provider store={store}>
        <PageLoader />
        <UserExperience />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product" element={<Products />} />
          <Route path="/product/:id" element={<Product />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/ai" element={<AICatalog />} />
          <Route path="/blockchain" element={<BlockchainDemo />} />
          <Route path="/product-card-demo" element={<ProductCardDemo />} />
          <Route path="*" element={<PageNotFound />} />
          <Route path="/product/*" element={<PageNotFound />} />
        </Routes>
      </Provider>
    </ScrollToTop>
    <Toaster />
  </HashRouter>
);
