import { Routes, Route, Navigate } from "react-router-dom";
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
  return (
    <>
      <Navbar />

      <div className="mt-4 px-4 min-h-screen">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/product/:id" element={<Product />} />
          <Route path="*" element={<Navigate to="/" />} />
          <Route path="/category/:categoryName" element={<CategoryPage />} />
          <Route path="/payment" element={<Payment />} />
           <Route path="/favourites" element={<Favourites />} /> 
          <Route path="/orders" element={<Orders />} />
          




        </Routes>
      </div>

      <Footer />
    </>
  );
}

export default App;
