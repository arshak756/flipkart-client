// src/pages/Cart.jsx

import { useEffect, useState } from "react";
import axios from "../utils/axiosInstance";

import { Link, useNavigate } from "react-router-dom";

const Cart = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const fetchCart = async () => {
    try {
      const res = await axios.get("api/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCart(res.data);
    } catch (err) {
      setError("Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (quantity < 1) return;
    try {
      await axios.put(
        "/api/cart/update",
        { productId, quantity },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchCart();
    } catch (err) {
      console.error("Failed to update quantity");
    }
  };

  const removeItem = async (productId) => {
    try {
      await axios.delete(`/api/cart/remove/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchCart();
    } catch (err) {
      console.error("Failed to remove item");
    }
  };

  const handlePlaceOrder = () => {
    if (!token) return alert("Please login to place your order");

    navigate("/payment", {
      state: {
        cart,
        totalPayable,
      },
    });
  };

  useEffect(() => {
    fetchCart();
  }, []);

  if (loading)
    return (
      <div className="p-10 text-center text-gray-500 text-lg font-medium">
        Loading your cart...
      </div>
    );

  if (error)
    return (
      <div className="p-10 text-center text-red-600 font-semibold">{error}</div>
    );

  if (!cart || cart.items.length === 0)
    return (
      <div className="p-20 text-center text-gray-600 text-xl font-semibold">
        Your cart is empty 🛒
      </div>
    );

  const itemTotal = cart.items.reduce(
    (sum, item) => sum + item.productId.price * item.quantity,
    0
  );
  const deliveryCharge = itemTotal > 999 ? 0 : 50;
  const discount = 0;
  const totalPayable = itemTotal + deliveryCharge - discount;

  return (
    <div className="max-w-7xl mx-auto mt-12 px-4 md:flex md:gap-12">
      {/* Left: Cart Items */}
      <div className="flex-1 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-3xl font-semibold mb-8 border-b pb-4">
          My Cart ({cart.items.length} items)
        </h2>

        {cart.items.map(({ productId: p, quantity }) => (
          <div
            key={p._id}
            className="flex flex-col md:flex-row items-center md:items-start gap-5 py-6 border-b border-gray-200 last:border-none"
          >
            <Link to={`/product/${p._id}`} className="block md:w-28 w-full">
              <img
                src={p.image}
                alt={p.name}
                className="w-full h-28 object-contain rounded-md border"
              />
            </Link>

            <div className="flex-1 flex flex-col md:justify-between">
              <Link
                to={`/product/${p._id}`}
                className="text-lg font-semibold text-blue-700 hover:underline"
              >
                {p.name}
              </Link>
              <p className="mt-1 text-gray-600 line-clamp-2">{p.description}</p>

              <div className="mt-4 flex items-center gap-4">
                <div className="flex border rounded-md overflow-hidden">
                  <button
                    onClick={() => updateQuantity(p._id, quantity - 1)}
                    disabled={quantity <= 1}
                    className="px-3 py-1 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 transition"
                  >
                    −
                  </button>
                  <div className="px-5 py-1 border-x text-center font-semibold text-lg select-none">
                    {quantity}
                  </div>
                  <button
                    onClick={() => updateQuantity(p._id, quantity + 1)}
                    className="px-3 py-1 bg-gray-100 hover:bg-gray-200 transition"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={() => removeItem(p._id)}
                  className="flex items-center gap-1 text-red-600 hover:bg-red-600 hover:text-white px-3 py-1 rounded text-sm font-semibold transition cursor-pointer select-none"
                >
                  Remove
                </button>
              </div>
            </div>

            <div className="mt-4 md:mt-0 md:w-28 flex flex-col items-end">
              <p className="text-xl font-bold text-gray-900">
                ₹{(p.price * quantity).toFixed(2)}
              </p>
              {p.discountPrice && (
                <p className="text-sm line-through text-gray-400">
                  ₹{(p.discountPrice * quantity).toFixed(2)}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Right: Price Summary */}
      <aside className="md:w-96 bg-white rounded-lg shadow-md p-6 mt-10 md:mt-0 sticky top-24 self-start">
        <h3 className="text-xl font-semibold mb-6 border-b pb-3">Price Details</h3>
        <div className="flex justify-between py-2">
          <span>Price ({cart.items.length} items)</span>
          <span>₹{itemTotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between py-2">
          <span>Delivery Charges</span>
          <span className={deliveryCharge === 0 ? "text-green-600" : ""}>
            {deliveryCharge === 0 ? "Free" : `₹${deliveryCharge.toFixed(2)}`}
          </span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between py-2 text-green-600">
            <span>Discount</span>
            <span>-₹{discount.toFixed(2)}</span>
          </div>
        )}
        <hr className="my-4" />
        <div className="flex justify-between font-semibold text-lg">
          <span>Total Payable</span>
          <span>₹{totalPayable.toFixed(2)}</span>
        </div>

        <button
          onClick={handlePlaceOrder}
          className="mt-8 w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 rounded shadow"
        >
          Place Order
        </button>
      </aside>
    </div>
  );
};

export default Cart;
