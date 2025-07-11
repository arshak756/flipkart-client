import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "../utils/axiosInstance";

import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { toast } from "react-toastify";

const stripePromise = loadStripe("pk_test_51RiBGRKwtjoMQd789RVCbxDTgAy7wcsTWkV3Sz2WibJyFlmp3HvxWsvxqp9N6fr1WQnD0RuW9aQ5HSRsb9VuIy7u00ligKVccP");

const Payment = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const { cart, totalPayable } = state || {};

  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("India");
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [loading, setLoading] = useState(false);

  const stripe = useStripe();
  const elements = useElements();

  const handlePlaceOrder = async () => {
    if (!address || !city || !postalCode || !country) {
      alert("Please fill in all address fields");
      return;
    }

    const shippingAddress = { address, city, postalCode, country };

    const orderItems = cart.items.map((item) => ({
      name: item.productId.name,
      qty: item.quantity,
      price: item.productId.price,
      product: item.productId._id,
    }));

    try {
      setLoading(true);

      
      const orderRes = await axios.post(
        "/api/orders",
        {
          orderItems,
          shippingAddress,
          paymentMethod: paymentMethod === "card" ? "Card Payment" : "Cash on Delivery",
          totalPrice: totalPayable,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const createdOrder = orderRes.data;

      if (paymentMethod === "cod") {
        
        await axios.delete("/api/cart/clear", {
          headers: { Authorization: `Bearer ${token}` },
        });

        navigate("/orders", {
          state: { successMessage: " Your order has been successfully placed!" },
        });
      } else {
        
        const paymentIntentRes = await axios.post(
          "/api/payments/create-payment-intent",
          { totalPrice: totalPayable },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const clientSecret = paymentIntentRes.data.clientSecret;

        
        const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
          payment_method: { card: elements.getElement(CardElement) },
        });

        if (error) {
          toast.error(error.message);
          return;
        }

        if (paymentIntent.status === "succeeded") {
          
          await axios.patch(
            `/api/orders/${createdOrder._id}/pay`,
            {},
            { headers: { Authorization: `Bearer ${token}` } }
          );

          await axios.delete("/api/cart/clear", {
            headers: { Authorization: `Bearer ${token}` },
          });

          toast.success(" Payment successful! Order placed.");
          navigate("/orders");
        }
      }
    } catch (err) {
      console.error(err);
      toast.error(" Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  if (!cart || cart.items.length === 0)
    return (
      <div className="text-center py-20 text-gray-600 text-xl">
        Cart is empty. Add products before payment.
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg mt-10 rounded">
      <h2 className="text-2xl font-bold mb-6">Checkout</h2>

      {/* Address Form */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-3">Enter Delivery Address</h3>
        <input type="text" placeholder="Street, House No, Landmark" value={address} onChange={(e) => setAddress(e.target.value)} className="w-full p-2 mb-3 border rounded" />
        <input type="text" placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} className="w-full p-2 mb-3 border rounded" />
        <input type="text" placeholder="Postal Code" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} className="w-full p-2 mb-3 border rounded" />
        <input type="text" placeholder="Country" value={country} onChange={(e) => setCountry(e.target.value)} className="w-full p-2 border rounded" />
      </div>

      {/* Payment Method */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Payment Method</h3>
        <label className="flex items-center gap-3 mb-2">
          <input type="radio" name="payment" value="cod" checked={paymentMethod === "cod"} onChange={() => setPaymentMethod("cod")} className="accent-blue-600" />
          <span>Cash on Delivery</span>
        </label>
        <label className="flex items-center gap-3">
          <input type="radio" name="payment" value="card" checked={paymentMethod === "card"} onChange={() => setPaymentMethod("card")} className="accent-blue-600" />
          <span>Card / Stripe Payment</span>
        </label>
      </div>

      {/* Stripe Card Element if Card selected */}
      {paymentMethod === "card" && (
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Enter Card Details</h3>
          <CardElement className="p-3 border rounded" options={{ style: { base: { fontSize: "16px" } } }} />
        </div>
      )}

      {/* Summary */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Order Summary</h3>
        {cart.items.map(({ productId: p, quantity }) => (
          <div key={p._id} className="flex justify-between py-2 border-b last:border-none">
            <div>
              <div className="font-medium text-gray-900">{p.name}</div>
              <div className="text-sm text-gray-600">Qty: {quantity}</div>
            </div>
            <div className="font-semibold text-gray-800">
              ₹{(p.price * quantity).toFixed(2)}
            </div>
          </div>
        ))}
        <div className="flex justify-between mt-4 font-bold text-lg">
          <span>Total Payable</span>
          <span>₹{totalPayable.toFixed(2)}</span>
        </div>
      </div>

      <button onClick={handlePlaceOrder} disabled={loading} className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 rounded shadow">
        {loading ? "Placing Order..." : "Place Order"}
      </button>
    </div>
  );
};

const WrappedPayment = () => (
  <Elements stripe={stripePromise}>
    <Payment />
  </Elements>
);

export default WrappedPayment;
