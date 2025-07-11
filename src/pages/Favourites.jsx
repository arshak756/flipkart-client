import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"
import axios from "../utils/axiosInstance";
import { toast } from "react-toastify";

const Favourites = () => {
  const [favorites, setFavorites] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) return toast.error("Login to see favorites");

    const fetchFavorites = async () => {
      try {
        const res = await axios.get("/api/users/favorites", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFavorites(res.data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch favorites");
      }
    };

    fetchFavorites();
  }, [token]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Your Favourite Products</h2>

      {favorites.length === 0 ? (
        <p className="text-gray-500">You haven’t liked any products yet.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {favorites.map((product) => (
            <div
              key={product._id}
              onClick={() => navigate(`/product/${product._id}`)}
              className="bg-white rounded-md p-4 shadow hover:shadow-lg cursor-pointer transition group"
            >
              <img
                src={product.image}
                alt={product.name}
                className="h-36 w-full object-contain mx-auto"
              />
              <h3 className="mt-2 text-sm font-semibold truncate">{product.name}</h3>
              <p className="text-sm text-gray-600 line-clamp-2">
                {product.description?.slice(0, 60) || "No description"}
              </p>
              <p className="text-blue-600 font-bold mt-2">₹{product.price}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favourites;
