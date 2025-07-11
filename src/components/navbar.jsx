import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import axios from "../utils/axiosInstance";


const Navbar = () => {
  const [user, setUser] = useState(null);
  const [showMobile, setShowMobile] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("userInfo"));
      if (stored) {
        setUser(stored);
      }
    } catch (err) {
      console.error("Failed to parse userInfo", err);
      setUser(null);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    setUser(null);
    navigate("/login");
  };

  const handleInputChange = async (e) => {
    const query = e.target.value;
    setSearchTerm(query);

    if (query.trim().length === 0) {
      setSuggestions([]);
      return;
    }

    try {
      const res = await axios.get(`/api/products?search=${query}`);
      setSuggestions(res.data.slice(0, 6));
    } catch (err) {
      console.error("Search error", err);
    }
  };

  const handleAddToCart = async (productId) => {
    const token = localStorage.getItem("token");
    if (!token) return alert("Login to add to cart");

    try {
      await axios.post(
        "/api/cart/add",
        { productId, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("✅ Product added to cart");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to add to cart");
    }
  };

  const handleClearSuggestions = () => {
    setTimeout(() => setSuggestions([]), 150);
  };

  return (
    <nav className="bg-[#2874f0] text-white sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex flex-col items-center gap-0 leading-none">
          <img
            src="https://static-assets-web.flixcart.com/www/linchpin/fk-cp-zion/img/flipkart-plus_8d85f4.png"
            alt="Flipkart"
            className="h-8 object-contain"
          />
          <div className="text-[11px] font-medium text-yellow-300 flex items-center gap-1 mt-[1px]">
            Explore <span className="text-white font-normal">Plus</span>
            <span className="text-yellow-300 text-xs">⭐</span>
          </div>
        </Link>

        {/* Search (desktop only) */}
        <div className="hidden md:flex flex-1 mx-4 relative">
          <input
            type="text"
            placeholder="Search for products..."
            value={searchTerm}
            onChange={handleInputChange}
            onBlur={handleClearSuggestions}
            className="w-full px-4 py-2 text-black rounded outline-none"
          />
          {suggestions.length > 0 && (
            <div className="absolute top-full mt-1 w-full bg-white text-black rounded shadow max-h-72 overflow-y-auto z-50">
              {suggestions.map((product) => (
                <div
                  key={product._id}
                  className="flex items-center justify-between px-3 py-2 hover:bg-gray-100 border-b"
                >
                  <div
                    onClick={() => {
                      navigate(`/product/${product._id}`);
                      setSearchTerm("");
                      setSuggestions([]);
                    }}
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-10 h-10 object-contain"
                    />
                    <div>
                      <p className="text-sm font-semibold">{product.name}</p>
                      <p className="text-xs text-gray-600">₹{product.price}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleAddToCart(product._id)}
                    className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded"
                  >
                    🛒
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right side buttons */}
        <div className="hidden md:flex items-center gap-5">
          {user ? (
            <div className="relative group">
              <button className="flex items-center gap-2 bg-white text-[#2874f0] px-4 py-1 rounded-full font-medium">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                  alt="Avatar"
                  className="w-6 h-6 rounded-full"
                />
              </button>
              <div className="absolute right-0 top-full mt-2 bg-white text-black w-48 shadow-md rounded hidden group-hover:block z-50">
                <div className="px-4 py-2 font-semibold border-b">👤 {user?.user?.name || "User"}</div>
                <Link to="/favourites" className="block px-4 py-2 hover:bg-gray-100">
                   Favourites
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                   Logout
                </button>
              </div>
            </div>
          ) : (
            <Link
              to="/login"
              className="bg-white text-[#2874f0] px-4 py-1 rounded font-medium hover:bg-gray-100"
            >
              Login
            </Link>
          )}

          <Link
            to="/orders"
            className="hover:bg-white hover:text-[#2874f0] bg-[#1565c0] px-4 py-1 rounded font-semibold transition"
          >
            📦 Orders
          </Link>

          <Link
            to="/cart"
            className="hover:bg-yellow-400 px-4 py-1 rounded transition bg-yellow-300 text-black font-bold"
          >
            🛒 Cart
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <button onClick={() => setShowMobile(!showMobile)}>
            {showMobile ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Search */}
      <div className="md:hidden px-4 pb-2 bg-[#2874f0]">
        <div className="relative">
          <input
            type="text"
            placeholder="Search products"
            value={searchTerm}
            onChange={handleInputChange}
            onBlur={handleClearSuggestions}
            className="w-full px-3 py-2 text-black rounded"
          />
          {suggestions.length > 0 && (
            <div className="absolute top-full mt-1 w-full bg-white text-black rounded shadow max-h-64 overflow-y-auto z-50">
              {suggestions.map((product) => (
                <div
                  key={product._id}
                  className="flex items-center justify-between px-3 py-2 hover:bg-gray-100 border-b"
                >
                  <div
                    onClick={() => {
                      navigate(`/product/${product._id}`);
                      setSearchTerm("");
                      setSuggestions([]);
                    }}
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-10 h-10 object-contain"
                    />
                    <div>
                      <p className="text-sm font-semibold">{product.name}</p>
                      <p className="text-xs text-gray-600">₹{product.price}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleAddToCart(product._id)}
                    className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded"
                  >
                    🛒
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Dropdown */}
      {showMobile && (
        <div className="md:hidden px-4 pb-4 bg-[#2874f0] space-y-2">
          {user ? (
            <>
              <div className="text-white">👤 {user?.user?.name || "User"}</div>
              <Link to="/favourites" className="hover:text-blue-600">
                 Favourites
              </Link>

              <button onClick={handleLogout} className="block text-white"> Logout</button>
            </>
          ) : (
            <Link to="/login" className="block bg-white text-[#2874f0] px-4 py-1 rounded font-medium">
              Login
            </Link>
          )}
          <Link to="/orders" className="block text-white">📦 Orders</Link>
          <Link to="/cart" className="block text-white">🛒 Cart</Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
