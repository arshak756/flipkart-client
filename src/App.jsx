import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

// Components
import Navbar from "./components/navbar";
import Footer from "./components/footer";

// Pages
import Home from "./pages/home";
import Login from "./pages/login";
import Register from "./pages/register";
import Cart from "./pages/cart";
import Product from "./pages/product";
import CategoryPage from "./pages/CategoryPage";
import Payment from "./pages/Payment";
import Orders from "./pages/Orders";
import Favourites from "./pages/Favourites";

function App() {
  const [user, setUser] = useState(null);

  // Load user from localStorage on initial render
  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("userInfo"));
      if (stored) setUser(stored);
    } catch {
      setUser(null);
    }
  }, []);

  return (
    <>
      {/* ✅ Pass user and setUser to Navbar */}
      <Navbar user={user} setUser={setUser} />

      <div className="mt-4 px-4 min-h-screen">
        <Routes>
          <Route path="/" element={<Home />} />

          {/* ✅ Pass setUser to Login and Register */}
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/register" element={<Register setUser={setUser} />} />

          <Route path="/cart" element={<Cart />} />
          <Route path="/product/:id" element={<Product />} />
          <Route path="/category/:categoryName" element={<CategoryPage />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/favourites" element={<Favourites />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>

      <Footer />
    </>
  );
}

export default App;
