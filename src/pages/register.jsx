import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../utils/axiosInstance";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      
      const res = await axios.post("/api/users/register", form);

      if (res.data) {
        
        const loginRes = await axios.post("/api/users/login", {
          email: form.email,
          password: form.password,
        });

        // Save user info to localStorage
        localStorage.setItem("userInfo", JSON.stringify(loginRes.data));

        // Redirect to homepage or dashboard
        navigate("/");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f1f3f6] flex items-center justify-center px-4">
      <div className="w-full max-w-4xl bg-white rounded-md shadow-lg flex overflow-hidden">
        {/* Left Panel */}
        <div className="w-1/2 bg-[#2874f0] text-white p-10 hidden md:flex flex-col justify-center">
          <h2 className="text-3xl font-bold mb-4">Looks like you're new here!</h2>
          <p className="text-sm">
            Sign up with your email address or use Google to get started.
          </p>
          <img
            src="https://img.freepik.com/free-vector/e-commerce-concept-illustration_114360-832.jpg"
            alt="register"
            className="mt-6 w-full"
          />
        </div>

        {/* Right Panel */}
        <div className="w-full md:w-1/2 p-8">
          <h2 className="text-xl font-bold mb-6 text-gray-800">Create Account</h2>

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          {/* Email/Password Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Enter Your Name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            <input
              type="email"
              name="email"
              placeholder="Enter Email Address"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter Password"
                value={form.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 pr-10"
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 cursor-pointer text-gray-500 hover:text-gray-700 text-sm"
              >
                {showPassword ? "🙈" : "👁️"}
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 rounded-sm transition"
            >
              {loading ? "Creating Account..." : "Continue"}
            </button>
          </form>

          {/* Google Login */}
          <div className="mt-6 text-center">
            <p className="text-gray-500 mb-2 text-sm">Or sign up using Google</p>
            <GoogleLogin
              onSuccess={async (credentialResponse) => {
                try {
                  const decoded = jwtDecode(credentialResponse.credential);
                  const res = await axios.post("/api/users/google", {
                    name: decoded.name,
                    email: decoded.email,
                    picture: decoded.picture,
                  });

                  if (res.data.token) {
                    localStorage.setItem("userInfo", JSON.stringify(res.data));
                    navigate("/");
                  }
                } catch (err) {
                  console.error("Google signup failed", err);
                }
              }}
              onError={() => {
                console.error("Google login was unsuccessful");
              }}
            />
          </div>

          <p className="text-sm text-gray-600 mt-4 text-center">
            Already have an account?{" "}
            <span
              className="text-blue-600 hover:underline cursor-pointer"
              onClick={() => navigate("/login")}
            >
              Login here
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
