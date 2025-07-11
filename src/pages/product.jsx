import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../utils/axiosInstance";
import { toast } from "react-toastify";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";

const Product = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isInCart, setIsInCart] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const res = await axios.get(`/api/products/${id}`);
      setProduct(res.data);
      setReviews(res.data.reviews || []);
    } catch (err) {
      console.error(err);
    }
  };

  const chartData = {
    labels: [1, 2, 3, 4, 5].map((n) => `${n}★`),
    datasets: [
      {
        label: "Number of Reviews",
        data: [1, 2, 3, 4, 5].map(
          (n) => reviews.filter((r) => r && r.rating === n).length
        ),
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        borderRadius: 4,
      },
    ],
  };

  const handleAddToCart = async () => {
    if (!token) return toast.error("Login to add to cart");
    await axios.post(
      "/api/cart/add",
      {
        productId: id,
        quantity,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setIsInCart(true);
    toast.success("Added to cart!");
  };

  const handleBuyNow = () => {
    if (!token) return toast.error("Login to continue");
    const fakeCart = {
      items: [{ productId: product, quantity }],
    };
    navigate("/payment", {
      state: {
        cart: fakeCart,
        totalPayable: product.price * quantity,
      },
    });
  };

  const handleReviewSubmit = async () => {
    if (!token) return toast.error("Login to post a review");

    try {
      await axios.post(
        `/api/products/${id}/review`,
        { rating, comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Review submitted!");
      setRating(5);
      setComment("");
      fetchProduct();
    } catch (err) {
      toast.error(err.response?.data?.message || "Submit failed");
    }
  };

  const handleReviewEdit = async (reviewId) => {
    const newRating = prompt("New rating (1-5):");
    const newComment = prompt("New comment:");
    if (!newRating || !newComment) return;

    try {
      await axios.patch(
        `/api/products/${id}/review/${reviewId}`,
        { rating: newRating, comment: newComment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Review updated!");
      fetchProduct();
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    }
  };

  const handleReviewDelete = async (reviewId) => {
    if (!window.confirm("Delete this review?")) return;

    try {
      await axios.delete(
        `/api/products/${id}/review/${reviewId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Review deleted");
      fetchProduct();
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed");
    }
  };

  if (!product) return <div className="p-6">Loading...</div>;

  let currentUserId = null;
try {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  currentUserId = userInfo?._id || userInfo?.user?._id || null;
} catch (error) {
  currentUserId = null;
}


  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* ✅ Product Info */}
      <div className="grid md:grid-cols-2 gap-10 bg-white p-6 rounded shadow-md">
        <img
          src={product.image}
          alt={product.name}
          className="h-80 object-contain mx-auto"
        />
        <div>
          <h1 className="text-2xl font-bold">{product.name}</h1>
          <p className="text-gray-500 mt-1">Brand: {product.brand}</p>
          <p className="text-2xl font-bold text-blue-600 mt-2">
            ₹{product.price}
          </p>

          {/* Quantity Control */}
          <div className="mt-4 flex items-center">
            <button
              onClick={() => setQuantity((q) => Math.max(q - 1, 1))}
              className="px-3 py-1 bg-gray-100"
            >
              −
            </button>
            <span className="px-5">{quantity}</span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              className="px-3 py-1 bg-gray-100"
            >
              +
            </button>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex gap-4">
            <button
              onClick={handleBuyNow}
              className="bg-yellow-500 px-6 py-2 rounded"
            >
              Buy Now
            </button>
            <button
              onClick={handleAddToCart}
              className={`px-6 py-2 rounded ${
                isInCart ? "bg-green-600" : "bg-blue-600"
              }`}
            >
              {isInCart ? "Added" : "Add to Cart"}
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded shadow mt-10">
  <h3 className="text-xl mb-4">Rating Breakdown</h3>
  {[5, 4, 3, 2, 1].map((star) => {
    const count = reviews.filter((r) => r && r.rating === star).length;
    const percentage = reviews.length ? (count / reviews.length) * 100 : 0;

    return (
      <div key={star} className="flex items-center gap-4 mb-2">
        <span className="w-10">{star}★</span>
        <div className="w-full bg-gray-200 rounded h-3 overflow-hidden">
          <div
            className="bg-blue-500 h-full"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
        <span className="w-6 text-sm">({count})</span>
      </div>
    );
  })}
</div>


      {/* 💬 Customer Reviews */}
      <div className="mt-10 bg-white p-6 rounded shadow">
        <h3 className="text-xl mb-4">Customer Reviews</h3>
        {Array.isArray(reviews) && reviews.length > 0 ? (
          reviews
            .filter((r) => r && (r._id || r.user))
            .map((r) => (
              <div
                key={r._id || `${r.user}-${r.rating}-${Math.random()}`}
                className="border-b py-3 flex justify-between"
              >
                <div>
                  <span className="bg-green-600 text-white px-2 rounded">
                    {r.rating}★
                  </span>
                  <p className="mt-1">{r.comment || "No comment"}</p>
                  <p className="text-xs text-gray-500">
                    by {r.name || "Anonymous"}
                  </p>
                </div>
                {currentUserId === r.user && (
                  <div className="flex flex-col gap-1 text-right">
                    <button
                      onClick={() => handleReviewEdit(r._id)}
                      className="text-blue-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleReviewDelete(r._id)}
                      className="text-red-600"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            ))
        ) : (
          <p>No reviews yet.</p>
        )}
      </div>

      {/* 📝 Write Review */}
      <div className="mt-8 bg-white p-6 rounded shadow">
        <h4 className="text-lg mb-2">Write a Review</h4>
        <div className="flex items-center gap-3 mb-2">
          <label>Rating:</label>
          <select
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
          >
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n}>{n}</option>
            ))}
          </select>
        </div>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows="3"
          className="w-full border p-2 mb-2"
        />
        <button
          onClick={handleReviewSubmit}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Submit Review
        </button>
      </div>
    </div>
  );
};

export default Product;
