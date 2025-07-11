// ... existing imports
import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import axios from "../utils/axiosInstance";

import { toast } from "react-toastify";

const CategoryPage = () => {
  const { categoryName } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const searchQuery = new URLSearchParams(location.search).get("search") || "";
  const subcategoryQuery = new URLSearchParams(location.search).get("type") || "";
  const brandQuery = new URLSearchParams(location.search).get("brand") || "";

  const [products, setProducts] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [selectedSub, setSelectedSub] = useState("All");
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedPrice, setSelectedPrice] = useState("All");
  const [liked, setLiked] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // ✅ Get min, max, and midpoint prices
  const prices = products.map((p) => Number(p.price) || 0);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const midPrice = Math.floor((minPrice + maxPrice) / 2);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const queryParams = new URLSearchParams();
        queryParams.append("category", categoryName);
        if (subcategoryQuery) queryParams.append("type", subcategoryQuery);
        if (brandQuery) queryParams.append("brand", brandQuery);
        if (searchQuery) queryParams.append("search", searchQuery);

        const [productRes, favoritesRes] = await Promise.all([
          axios.get(`/api/products?${queryParams.toString()}`),
          token
            ? axios.get(`/api/users/favorites`, {
                headers: { Authorization: `Bearer ${token}` },
              })
            : Promise.resolve({ data: [] }),
        ]);

        setProducts(productRes.data);
        setSubcategories([
          ...new Set(productRes.data.map((p) => p.subcategory).filter(Boolean)),
        ]);
        setBrands([...new Set(productRes.data.map((p) => p.brand).filter(Boolean))]);
        setSelectedBrands(brandQuery ? [brandQuery] : []);
        setLiked(favoritesRes.data.map((f) => f._id));
        setLoading(false);
      } catch (err) {
        console.error("Error fetching:", err);
        setLoading(false);
      }
    };

    fetchData();
  }, [categoryName, location.search]);

  const matchesPrice = (price) => {
    if (selectedPrice === "All") return true;

    const [min, max] = selectedPrice.split("-").map(Number);
    return price >= min && price <= max;
  };

  const filteredProducts = products.filter((p) => {
    const matchSub =
      selectedSub === "All" ||
      (p.subcategory && p.subcategory.toLowerCase() === selectedSub.toLowerCase());

    const matchBrand =
      selectedBrands.length === 0 ||
      selectedBrands.map((b) => b.toLowerCase()).includes(p.brand?.toLowerCase());

    const matchPrice = matchesPrice(p.price);

    return matchSub && matchBrand && matchPrice;
  });

  const toggleLike = async (productId) => {
    if (!token) return toast.error("Login to like products");

    try {
      if (liked.includes(productId)) {
        await axios.delete(`/api/users/favorites/${productId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLiked((prev) => prev.filter((id) => id !== productId));
      } else {
        await axios.post(
          `/api/users/favorites/${productId}`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setLiked((prev) => [...prev, productId]);
      }
    } catch (err) {
      console.error("Toggle favorite error:", err);
      toast.error("Error updating favorites");
    }
  };

  if (loading) return <div className="p-10 text-center text-lg">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 relative">
      <h2 className="text-2xl font-bold mb-4 capitalize text-gray-800">
        {searchQuery
          ? `${searchQuery} in ${categoryName}`
          : `Explore ${categoryName}${subcategoryQuery ? ` / ${subcategoryQuery}` : ""}`}
      </h2>

      {/* Mobile Filter Button */}
      <div className="md:hidden flex justify-end mb-4">
        <button
          onClick={() => setShowMobileFilters(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded shadow"
        >
          Filters
        </button>
      </div>

      {/* Mobile Overlay */}
      {showMobileFilters && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-30 md:hidden"
          onClick={() => setShowMobileFilters(false)}
        />
      )}

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar Filters */}
        <aside
          className={`bg-white p-5 rounded-md shadow-md text-sm md:w-1/5 w-64 fixed md:static top-0 left-0 h-full z-40 transform transition-transform duration-300 ease-in-out
          ${showMobileFilters ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
        >
          {/* Mobile close button */}
          <div className="flex justify-between items-center mb-4 md:hidden">
            <h4 className="font-semibold text-lg">Filters</h4>
            <button
              onClick={() => setShowMobileFilters(false)}
              className="text-gray-500 text-2xl leading-none"
            >
              &times;
            </button>
          </div>

          {/* Subcategories */}
          {subcategories.length > 0 && (
            <div className="mb-6">
              <h4 className="font-semibold mb-2">Subcategories</h4>
              <button
                className={`block mb-1 ${
                  selectedSub === "All" ? "text-blue-600 font-bold" : "text-gray-600"
                }`}
                onClick={() => setSelectedSub("All")}
              >
                All
              </button>
              {subcategories.map((sub) => (
                <button
                  key={sub}
                  className={`block mb-1 ${
                    selectedSub === sub ? "text-blue-600 font-bold" : "text-gray-600"
                  }`}
                  onClick={() => setSelectedSub(sub)}
                >
                  {sub}
                </button>
              ))}
            </div>
          )}

          {/* Brands */}
          {brands.length > 0 && (
            <div className="mb-6">
              <h4 className="font-semibold mb-2">Brands</h4>
              {brands.map((brand) => (
                <label key={brand} className="block mb-1 text-gray-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedBrands
                      .map((b) => b.toLowerCase())
                      .includes(brand.toLowerCase())}
                    onChange={() =>
                      setSelectedBrands((prev) =>
                        prev
                          .map((b) => b.toLowerCase())
                          .includes(brand.toLowerCase())
                          ? prev.filter((b) => b.toLowerCase() !== brand.toLowerCase())
                          : [...prev, brand]
                      )
                    }
                    className="mr-2"
                  />
                  {brand}
                </label>
              ))}
            </div>
          )}

          {/* ✅ Dynamic 3-Level Price Filter */}
          <div>
            <h4 className="font-semibold mb-2">Price Range</h4>
            <label className="block mb-1 text-gray-600 cursor-pointer">
              <input
                type="radio"
                name="price"
                checked={selectedPrice === "All"}
                onChange={() => setSelectedPrice("All")}
                className="mr-2"
              />
              All
            </label>
            {products.length > 0 && (
              <>
                <label className="block mb-1 text-gray-600 cursor-pointer">
                  <input
                    type="radio"
                    name="price"
                    checked={selectedPrice === `${minPrice}-${midPrice}`}
                    onChange={() => setSelectedPrice(`${minPrice}-${midPrice}`)}
                    className="mr-2"
                  />
                  ₹{minPrice} – ₹{midPrice}
                </label>
                <label className="block mb-1 text-gray-600 cursor-pointer">
                  <input
                    type="radio"
                    name="price"
                    checked={selectedPrice === `${midPrice + 1}-${maxPrice}`}
                    onChange={() => setSelectedPrice(`${midPrice + 1}-${maxPrice}`)}
                    className="mr-2"
                  />
                  ₹{midPrice + 1} – ₹{maxPrice}
                </label>
              </>
            )}
          </div>
        </aside>

        {/* Product Grid */}
        <main className="md:w-4/5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {filteredProducts.length === 0 ? (
            <p className="text-gray-500 col-span-full">No products match your filters.</p>
          ) : (
            filteredProducts.map((product) => (
              <div
                key={product._id}
                onClick={() => navigate(`/product/${product._id}`)}
                className="relative bg-white p-4 rounded-md shadow hover:shadow-lg transition cursor-pointer group"
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleLike(product._id);
                  }}
                  className={`absolute top-2 right-2 text-xl ${
                    liked.includes(product._id) ? "text-red-500" : "text-gray-400"
                  } hover:scale-110 transition`}
                >
                  ♥
                </button>

                <img
                  src={product.image}
                  alt={product.name}
                  className="h-36 w-full object-contain mx-auto"
                />
                <h3 className="mt-3 text-sm font-medium truncate text-gray-800">
                  {product.name}
                </h3>
                <p className="text-gray-600 text-xs mt-1 line-clamp-2">
                  {product.description?.slice(0, 60) || "No description"}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <p className="text-blue-600 font-bold text-sm">₹{product.price}</p>
                  <img
                    src="https://img1a.flixcart.com/www/linchpin/fk-cp-zion/img/fa_62673a.png"
                    alt="Flipkart Assured"
                    className="h-4"
                  />
                </div>
              </div>
            ))
          )}
        </main>
      </div>
    </div>
  );
};

export default CategoryPage;
