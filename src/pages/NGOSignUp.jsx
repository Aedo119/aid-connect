// src/pages/DonorSignUp.jsx
import { useState } from "react";
import { Mail, Lock, User, Phone, MapPin, Check, Heart, Globe, Home } from "lucide-react";
import Footer from "../components/Footer";

export default function DonorSignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-yellow-100 via-teal-500 via-rose-300 to-rose-500">
      {/* Main content with padding */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        {/* Card */}
        <div className="bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-xl w-full max-w-md">
          {/* Heart Icon at the top */}
          <div className="flex justify-center mb-4">
            <div className="bg-pink-100 p-3 rounded-full">
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

          {/* Organization Name */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Organization Name
            </label>
            <div className="flex items-center border rounded-lg px-3 bg-gray-50 focus-within:ring-2 focus-within:ring-teal-400">
              <User className="h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Enter your full name"
                className="w-full p-2 bg-transparent outline-none"
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
                placeholder="Enter your email"
                className="w-full p-2 bg-transparent outline-none"
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
                placeholder="Create a password"
                className="w-full p-2 bg-transparent outline-none"
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
                placeholder="Confirm your password"
                className="w-full p-2 bg-transparent outline-none"
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
                placeholder="Enter your phone number"
                className="w-full p-2 bg-transparent outline-none"
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
                placeholder="Enter your street address"
                className="w-full p-2 bg-transparent outline-none"
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
                placeholder="Enter your postal code"
                className="w-full p-2 bg-transparent outline-none"
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
                type="text"
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
                <div className={`w-5 h-5 flex items-center justify-center rounded-md border-2 transition-all duration-200 ${agreeToTerms ? 'bg-rose-500 border-rose-500' : 'bg-white border-gray-300'}`}>
                  {agreeToTerms && (
                    <Check className="h-4 w-4 text-white stroke-[3]" />
                  )}
                </div>
              </div>
              <span className="text-gray-700">
                I agree to the <a href="#" className="text-rose-600 hover:underline">Terms of Service</a> and <a href="#" className="text-rose-600 hover:underline">Privacy Policy</a>
              </span>
            </label>
          </div>

          {/* Create Account Button */}
          <button className="w-full bg-rose-500 text-white py-2 rounded-lg hover:bg-rose-600 transition">
            Create your donor account
          </button>

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