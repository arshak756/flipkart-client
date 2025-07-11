import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../utils/axiosInstance";

import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post("/api/users/login", {
        email,
        password,
      });

      const { token, user } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("userInfo", JSON.stringify(user));

      if (user.isAdmin) {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      const { name, email, picture } = decoded;

      const res = await axios.post("/api/users/google", {
        name,
        email,
        picture,
      });

      const { token, user } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("userInfo", JSON.stringify(user));

      if (user.isAdmin) {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error("Google login failed:", err);
      setError("Google login failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[90vh] bg-gray-100 px-4">
      <div className="bg-white flex w-full max-w-4xl rounded-md shadow-lg overflow-hidden">
        {/* Left Side Banner */}
        <div className="bg-[#2874f0] text-white w-1/3 p-8 flex flex-col justify-center">
          <h2 className="text-3xl font-bold mb-4">Login</h2>
          <p className="text-sm">
            Get access to your Orders, Wishlist and Recommendations.
          </p>
          <img
            src="https://img.freepik.com/free-vector/mobile-login-concept-illustration_114360-135.jpg"
            alt="login"
            className="mt-8 w-full h-40 object-contain"
          />
        </div>

        {/* Right Side Form */}
        <form onSubmit={handleSubmit} className="w-2/3 p-8 bg-white">
          {error && (
            <div className="bg-red-100 text-red-700 p-2 mb-4 rounded text-sm">
              {error}
            </div>
          )}

          <input
            type="email"
            placeholder="Enter Email"
            className="w-full border p-3 mb-4 rounded outline-[#2874f0]"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter Password"
              className="w-full border p-3 mb-4 rounded outline-[#2874f0] pr-10"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-sm cursor-pointer text-gray-500"
            >
              {showPassword ? "🙈" : "👁️"}
            </span>
          </div>

          <button
            type="submit"
            className="w-full bg-[#fb641b] hover:bg-[#e1570b] text-white font-semibold py-2 rounded"
          >
            Login
          </button>

          {/* Google Login Button */}
          <div className="mt-6 text-center">
            <p className="text-gray-500 mb-2 text-sm">Or sign in using Google</p>
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => {
                setError("Google login failed");
              }}
            />
          </div>

          <p className="mt-6 text-sm text-center">
            New to Flipkart?{" "}
            <span
              className="text-[#2874f0] cursor-pointer hover:underline"
              onClick={() => navigate("/register")}
            >
              Create an account
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
