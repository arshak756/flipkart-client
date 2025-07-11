import { useEffect, useState } from "react";
import axios from "../utils/axiosInstance";

import { toast } from "react-toastify";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  const fetchOrders = async () => {
    try {
      const res = await axios.get("/api/orders/myorders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data);
    } catch (err) {
      console.error("Failed to load orders", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;

    try {
      await axios.delete(`/api/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Order canceled successfully");
      fetchOrders(); 
    } catch (err) {
      console.error("Cancel failed:", err);
      toast.error("Cancel failed");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getDeliveryDate = (createdAt) => {
    const date = new Date(createdAt);
    date.setDate(date.getDate() + 5);
    return date.toLocaleDateString("en-IN", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="p-20 text-center text-lg text-gray-500">Loading orders...</div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="p-20 text-center text-lg text-gray-600 font-semibold">
        You have no past orders.
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-semibold mb-8">My Orders</h2>
      <div className="space-y-8">
        {orders.map((order) => (
          <div
            key={order._id}
            className="border border-gray-200 rounded-lg p-6 shadow-sm bg-white"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-blue-600">
                Order #{order._id.slice(-6).toUpperCase()}
              </h3>
              <span className="text-sm text-gray-500">
                {new Date(order.createdAt).toLocaleString()}
              </span>
            </div>

            {/* ✅ Payment Status Badge */}
            <div className="mb-3">
              {order.isPaid ? (
                <span className="inline-block bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">
                  ✅ Paid on {new Date(order.paidAt).toLocaleDateString()}
                </span>
              ) : (
                <span className="inline-block bg-red-100 text-red-700 text-xs font-semibold px-3 py-1 rounded-full">
                  ❌ Not Paid
                </span>
              )}
            </div>

            <div className="mb-4 text-sm leading-6 text-gray-700">
              <p>
                <span className="font-semibold">Shipping to:</span>{" "}
                {order.shippingAddress.address}, {order.shippingAddress.city},{" "}
                {order.shippingAddress.postalCode},{" "}
                {order.shippingAddress.country}
              </p>
              <p>
                <span className="font-semibold">Payment:</span>{" "}
                {order.paymentMethod}
              </p>
              <p>
                <span className="font-semibold">Delivery Status:</span>{" "}
                {order.isDelivered ? (
                  <span className="text-green-600">Delivered</span>
                ) : (
                  <span className="text-yellow-600">Pending</span>
                )}
              </p>
              <p>
                <span className="font-semibold">Estimated Delivery:</span>{" "}
                {getDeliveryDate(order.createdAt)}
              </p>
            </div>

            <div className="border-t pt-4">
              {order.orderItems.map((item, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center gap-4 py-3 border-b last:border-none"
                >
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="font-medium text-gray-800">{item.name}</p>
                      <p className="text-sm text-gray-500">Qty: {item.qty}</p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-600">
                    ₹{(item.price * item.qty).toFixed(2)}
                  </span>
                </div>
              ))}
              <div className="text-right mt-4 font-semibold text-blue-700">
                Total: ₹{order.totalPrice.toFixed(2)}
              </div>
            </div>

            {/* Cancel Button */}
            {!order.isDelivered && (
              <div className="text-right mt-4">
                <button
                  onClick={() => handleCancelOrder(order._id)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white font-medium px-4 py-2 rounded shadow"
                >
                  Cancel Order
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
