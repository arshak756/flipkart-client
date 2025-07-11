import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// 🔁 Replace with your actual Google Client ID
const clientId = "559047012954-jg92b09ggfvevt68hl5s894444l6akb7.apps.googleusercontent.com";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={clientId}>
      <BrowserRouter>
        <>
          <App />
          <ToastContainer position="top-center" autoClose={3000} />
        </>
      </BrowserRouter>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
