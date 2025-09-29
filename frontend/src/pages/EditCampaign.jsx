// src/pages/EditCampaign.jsx
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { campaigns } from "../data/campaigns";
import { ArrowLeft, Save, Image, DollarSign, Calendar, MapPin, Users } from "lucide-react";
import Footer from "../components/Footer";

export default function EditCampaign() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    goal: "",
    category: "",
    location: "",
    endDate: "",
    donationTypes: []
  });

  useEffect(() => {
    // Simulate API call delay
    setTimeout(() => {
      const found = campaigns.find(c => c.id === parseInt(id));
      if (found) {
        setCampaign(found);
        setFormData({
          title: found.title,
          description: found.desc,
          goal: found.goal,
          category: found.category,
          location: found.location,
          endDate: found.endDate,
          donationTypes: found.donationTypes
        });
      }
      setLoading(false);
    }, 500);
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        donationTypes: checked 
          ? [...prev.donationTypes, value]
          : prev.donationTypes.filter(type => type !== value)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, this would call an API to update the campaign
    console.log("Updating campaign:", formData);
    alert("Campaign updated successfully!");
    navigate("/ngo-dashboard");
  };

  const donationTypeOptions = [
    { value: "money", label: "Financial Donation", icon: DollarSign },
    { value: "food", label: "Food Donation", icon: Image },
    { value: "clothes", label: "Clothing Donation", icon: Users },
    { value: "medical-supplies", label: "Medical Supplies", icon: Image }
  ];

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-green-200 via-teal-400 to-rose-400">
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500"></div>
        </div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-green-200 via-teal-400 to-rose-400">
        <div className="flex-1 flex items-center justify-center">
          <div className="bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-xl text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Campaign Not Found</h2>
            <p className="text-gray-600 mb-4">The campaign you're looking for doesn't exist.</p>
            <button
              onClick={() => navigate("/ngo/dashboard")}
              className="bg-rose-500 text-white px-6 py-2 rounded-lg hover:bg-rose-600 transition"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-green-200 via-teal-400 to-rose-400">
      {/* Main Content */}
      <main className="flex-1 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => navigate("/ngo-dashboard")}
              className="flex items-center text-gray-700 hover:text-rose-500 transition mb-4"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Dashboard
            </button>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Edit Campaign</h1>
            <p className="text-gray-600">Update your campaign details and settings</p>
          </div>

          {/* Edit Form */}
          <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Campaign Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Campaign Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-300 focus:border-transparent"
                  placeholder="Enter campaign title"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="4"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-300 focus:border-transparent"
                  placeholder="Describe your campaign and its impact"
                  required
                />
              </div>

              {/* Goal and Category */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <DollarSign className="h-4 w-4 inline mr-1" />
                    Fundraising Goal ($)
                  </label>
                  <input
                    type="number"
                    name="goal"
                    value={formData.goal}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-300 focus:border-transparent"
                    placeholder="50000"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-300 focus:border-transparent"
                  >
                    <option value="Emergency Relief">Emergency Relief</option>
                    <option value="Water & Sanitation">Water & Sanitation</option>
                    <option value="Education">Education</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Environment">Environment</option>
                    <option value="Community Development">Community Development</option>
                  </select>
                </div>
              </div>

              {/* Location and End Date */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="h-4 w-4 inline mr-1" />
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-300 focus:border-transparent"
                    placeholder="Enter campaign location"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="h-4 w-4 inline mr-1" />
                    End Date
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-300 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              {/* Donation Types */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Accepted Donation Types
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {donationTypeOptions.map((option) => {
                    const Icon = option.icon;
                    return (
                      <label
                        key={option.value}
                        className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition-all ${
                          formData.donationTypes.includes(option.value)
                            ? 'border-rose-500 bg-rose-50'
                            : 'border-gray-300 hover:border-rose-300'
                        }`}
                      >
                        <input
                          type="checkbox"
                          value={option.value}
                          checked={formData.donationTypes.includes(option.value)}
                          onChange={handleInputChange}
                          className="hidden"
                        />
                        <Icon className="h-5 w-5 mr-2 text-gray-600" />
                        <span className="text-sm font-medium text-gray-700">
                          {option.label}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Image Upload (Placeholder) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Campaign Image
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Image className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600 mb-2">Click to upload or drag and drop</p>
                  <p className="text-sm text-gray-500">PNG, JPG, GIF up to 10MB</p>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => navigate("/ngo/dashboard")}
                  className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-rose-500 text-white py-3 rounded-lg hover:bg-rose-600 transition flex items-center justify-center"
                >
                  <Save className="h-5 w-5 mr-2" />
                  Save Changes
                </button>
              </div>
            </form>
          </div>

          {/* Campaign Preview Section */}
          <div className="mt-8 bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Campaign Preview</h3>
            <div className="border border-gray-200 rounded-lg p-6">
              <h4 className="font-bold text-lg text-gray-800 mb-2">{formData.title}</h4>
              <p className="text-gray-600 mb-4">{formData.description}</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Goal:</span>
                  <p className="font-medium">${formData.goal?.toLocaleString()}</p>
                </div>
                <div>
                  <span className="text-gray-500">Category:</span>
                  <p className="font-medium">{formData.category}</p>
                </div>
                <div>
                  <span className="text-gray-500">Location:</span>
                  <p className="font-medium">{formData.location}</p>
                </div>
                <div>
                  <span className="text-gray-500">End Date:</span>
                  <p className="font-medium">{formData.endDate}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}