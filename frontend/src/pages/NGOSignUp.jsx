// src/pages/NGOSignUp.jsx
import { useState } from "react";
import {
  Mail,
  Lock,
  User,
  Phone,
  MapPin,
  Check,
  Heart,
  Globe,
  Home,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../API/api.js";
import Footer from "../components/Footer";

export default function NGOSignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    address: "",
    postalCode: "",
    websiteUrl: "",
    description: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (!agreeToTerms) {
      setError("Please agree to the Terms of Service and Privacy Policy");
      setLoading(false);
      return;
    }

    try {
      const { confirmPassword, ...signupData } = formData;
      const response = await authAPI.orgSignup(signupData);
      setSuccess(response.message);
      setTimeout(() => {
        navigate("/ngo-login");
      }, 2000);
    } catch (err) {
      setError(err.error || err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-yellow-100 via-teal-500 via-rose-300 to-rose-500">
      {/* Main content with padding */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
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
            Join AidConnect+
          </h2>
          <p className="text-gray-600 text-center text-sm mb-6">
            Create your organization account and start making a difference.
          </p>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg text-sm">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Organization Name */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Organization Name
              </label>
              <div className="flex items-center border rounded-lg px-3 bg-gray-50 focus-within:ring-2 focus-within:ring-teal-400">
                <User className="h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your organization name"
                  className="w-full p-2 bg-transparent outline-none"
                  required
                />
              </div>
            </div>

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
                  placeholder="Create a password"
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

            {/* Confirm Password */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <div className="flex items-center border rounded-lg px-3 bg-gray-50 focus-within:ring-2 focus-within:ring-teal-400">
                <Lock className="h-5 w-5 text-gray-400" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  className="w-full p-2 bg-transparent outline-none"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="text-gray-400 hover:text-gray-600 ml-2"
                >
                  👁
                </button>
              </div>
            </div>

            {/* Phone Number */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <div className="flex items-center border rounded-lg px-3 bg-gray-50 focus-within:ring-2 focus-within:ring-teal-400">
                <Phone className="h-5 w-5 text-gray-400" />
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  className="w-full p-2 bg-transparent outline-none"
                  required
                />
              </div>
            </div>

            {/* Address */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <div className="flex items-center border rounded-lg px-3 bg-gray-50 focus-within:ring-2 focus-within:ring-teal-400">
                <Home className="h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter your street address"
                  className="w-full p-2 bg-transparent outline-none"
                  required
                />
              </div>
            </div>

            {/* Postal Code */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Postal Code
              </label>
              <div className="flex items-center border rounded-lg px-3 bg-gray-50 focus-within:ring-2 focus-within:ring-teal-400">
                <MapPin className="h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  placeholder="Enter your postal code"
                  className="w-full p-2 bg-transparent outline-none"
                  required
                />
              </div>
            </div>

            {/* Website */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Website
              </label>
              <div className="flex items-center border rounded-lg px-3 bg-gray-50 focus-within:ring-2 focus-within:ring-teal-400">
                <Globe className="h-5 w-5 text-gray-400" />
                <input
                  type="url"
                  name="websiteUrl"
                  value={formData.websiteUrl}
                  onChange={handleChange}
                  placeholder="https://yourwebsite.com"
                  className="w-full p-2 bg-transparent outline-none"
                />
              </div>
            </div>

            {/* Organization Description */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Organization Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Briefly describe your organization"
                className="w-full p-2 bg-transparent outline-none border rounded-lg px-3 bg-gray-50 focus-within:ring-2 focus-within:ring-teal-400"
                rows={3}
              ></textarea>
            </div>

            {/* Terms Agreement */}
            <div className="flex items-center mb-6 text-sm">
              <label className="flex items-center space-x-2 cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={agreeToTerms}
                    onChange={() => setAgreeToTerms(!agreeToTerms)}
                    className="absolute opacity-0 h-0 w-0"
                  />
                  <div
                    className={`w-5 h-5 flex items-center justify-center rounded-md border-2 transition-all duration-200 ${
                      agreeToTerms
                        ? "bg-rose-500 border-rose-500"
                        : "bg-white border-gray-300"
                    }`}
                  >
                    {agreeToTerms && (
                      <Check className="h-4 w-4 text-white stroke-[3]" />
                    )}
                  </div>
                </div>
                <span className="text-gray-700">
                  I agree to the{" "}
                  <a href="#" className="text-rose-600 hover:underline">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-rose-600 hover:underline">
                    Privacy Policy
                  </a>
                </span>
              </label>
            </div>

            {/* Create Account Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-rose-500 text-white py-2 rounded-lg hover:bg-rose-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading
                ? "Creating Account..."
                : "Create your organization account"}
            </button>
          </form>

          {/* Links */}
          <p className="mt-4 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <a href="/ngo-login" className="text-rose-600 hover:underline">
              Login here
            </a>
          </p>
          <p className="mt-1 text-center text-sm text-gray-600">
            Are you a Donor?{" "}
            <a href="/donor-signup" className="text-rose-600 hover:underline">
              Donor Sign Up
            </a>
          </p>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
