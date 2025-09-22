// src/pages/DonorLogin.jsx
import { useState } from "react";
import { Mail, Lock, Check, Heart } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";

export default function DonorLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const { userLogin } = useAuth();
  const navigate = useNavigate();
  

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await userLogin(formData.email, formData.password);
      if (result.success) {
        navigate("/");

      } else {
        setError(result.message);
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-yellow-100 via-teal-500 via-rose-300 to-rose-500">
      {/* Main content with padding */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-16">
        {/* Card */}
        <div className="bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-xl w-full max-w-md">
          {/* Heart Icon at the top */}
          <div className="flex justify-center mb-4">
            <div className="bg-rose-100 p-3 rounded-full">
              <Heart className="h-8 w-8 text-rose-500 fill-rose-500" />
            </div>
          </div>
          
          {/* Heading */}
          <h2 className="text-3xl font-extrabold text-gray-800 text-center mb-2">
            Donor Login
          </h2>
          <p className="text-gray-600 text-center text-sm mb-6">
            Welcome back! Continue your journey of giving
          </p>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email address
              </label>
              <div className="flex items-center border rounded-lg px-3 bg-gray-50 focus-within:ring-2 focus-within:ring-teal-400">
                <Mail className="h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="w-full p-2 bg-transparent outline-none"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="flex items-center border rounded-lg px-3 bg-gray-50 focus-within:ring-2 focus-within:ring-teal-400">
                <Lock className="h-5 w-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="w-full p-2 bg-transparent outline-none"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-400 hover:text-gray-600 ml-2"
                >
                  👁
                </button>
              </div>
            </div>

            {/* Remember + Forgot */}
            <div className="flex justify-between items-center mb-4 text-sm">
              <label className="flex items-center space-x-2 cursor-pointer">
                {/* Custom Checkbox */}
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                    className="absolute opacity-0 h-0 w-0"
                  />
                  <div className={`w-5 h-5 flex items-center justify-center rounded-md border-2 transition-all duration-200 ${rememberMe ? 'bg-rose-500 border-rose-500' : 'bg-white border-gray-300'}`}>
                    {rememberMe && (
                      <Check className="h-4 w-4 text-white stroke-[3]" />
                    )}
                  </div>
                </div>
                <span className="text-gray-700">Remember me</span>
              </label>
              <a href="#" className="text-rose-600 hover:underline">
                Forgot password?
              </a>
            </div>

            {/* Sign In Button */}
            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-rose-500 text-white py-2 rounded-lg hover:bg-rose-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          {/* Links */}
          <p className="mt-4 text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <a href="/donor-signup" className="text-rose-600 hover:underline">
              Sign up here
            </a>
          </p>
          <p className="mt-1 text-center text-sm text-gray-600">
            Are you an organization?{" "}
            <a href="/ngo-login" className="text-rose-600 hover:underline">
              NGO Login
            </a>
          </p>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}