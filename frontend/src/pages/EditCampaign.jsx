// src/pages/EditCampaign.jsx
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { campaigns } from "../data/campaigns";
import { ArrowLeft, Save, Image, DollarSign, Calendar, MapPin, Users, Upload, AlertTriangle, Check } from "lucide-react";
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
    donationTypes: [],
    is_emergency: false,
    label_right: "",
    days_left: ""
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const categories = [
    "Emergency Relief",
    "Water & Sanitation",
    "Education",
    "Healthcare",
    "Environment",
    "Animal Welfare",
    "Community Development",
    "Arts & Culture",
    "Disaster Relief",
    "Human Rights",
    "Poverty Alleviation"
  ];

  const donationTypeOptions = [
    { value: "money", label: "Financial Donation" },
    { value: "food", label: "Food Donation" },
    { value: "clothes", label: "Clothing Donation" },
    { value: "medical-supplies", label: "Medical Supplies" }
  ];

  useEffect(() => {
    // Simulate API call delay
    setTimeout(() => {
      const found = campaigns.find(c => c.id === parseInt(id));
      if (found) {
        setCampaign(found);
        setFormData({
          title: found.title,
          description: found.desc || found.description,
          goal: found.goal,
          category: found.category,
          location: found.location,
          endDate: found.endDate,
          donationTypes: found.donationTypes,
          is_emergency: found.label_left === "Emergency",
          label_right: found.label_right || "",
          days_left: found.daysLeft?.toString() || ""
        });
        // Set image preview if campaign has an image
        if (found.image) {
          setImagePreview(found.image);
        }
      }
      setLoading(false);
    }, 500);
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleDonationTypeChange = (value) => {
    setFormData(prev => ({
      ...prev,
      donationTypes: prev.donationTypes.includes(value)
        ? prev.donationTypes.filter(type => type !== value)
        : [...prev.donationTypes, value]
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const calculateDaysLeft = () => {
    if (formData.endDate) {
      const endDate = new Date(formData.endDate);
      const today = new Date();
      const timeDiff = endDate.getTime() - today.getTime();
      const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));
      setFormData(prev => ({
        ...prev,
        days_left: daysLeft > 0 ? daysLeft.toString() : "0"
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // In a real app, this would call an API to update the campaign
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log("Updating campaign:", formData);
      alert("Campaign updated successfully!");
      navigate("/ngo/dashboard");
    } catch (error) {
      console.error("Error updating campaign:", error);
      alert("Failed to update campaign. Please try again.");
    }
  };

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
              onClick={() => navigate("/ngo/dashboard")}
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
                  Campaign Title *
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
                  Description *
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
                    Fundraising Goal ($) *
                  </label>
                  <input
                    type="number"
                    name="goal"
                    value={formData.goal}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-300 focus:border-transparent"
                    placeholder="50000"
                    min="1"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-300 focus:border-transparent"
                    required
                  >
                    <option value="">Select a category</option>
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Location and Emergency Status */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="h-4 w-4 inline mr-1" />
                    Location *
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
                    Campaign Type
                  </label>
                  <div className="space-y-4">
                    {/* Emergency Campaign Checkbox */}
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <div className="relative">
                        <input
                          type="checkbox"
                          name="is_emergency"
                          checked={formData.is_emergency}
                          onChange={handleInputChange}
                          className="absolute opacity-0 h-0 w-0"
                        />
                        <div className={`w-5 h-5 flex items-center justify-center rounded-md border-2 transition-all duration-200 ${
                          formData.is_emergency ? 'bg-rose-500 border-rose-500' : 'bg-white border-gray-300'
                        }`}>
                          {formData.is_emergency && (
                            <Check className="h-4 w-4 text-white stroke-[3]" />
                          )}
                        </div>
                      </div>
                      <div className="flex items-center">
                        <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                        <div>
                          <span className="font-medium text-gray-700">Emergency Campaign</span>
                          <p className="text-sm text-gray-500">Check if this is an urgent relief effort</p>
                        </div>
                      </div>
                    </label>

                    {/* Right Label Input */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Campaign Tag (Optional)
                      </label>
                      <input
                        type="text"
                        name="label_right"
                        value={formData.label_right}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-300 focus:border-transparent"
                        placeholder="e.g., Relief Work, Community Support"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="h-4 w-4 inline mr-1" />
                    Start Date *
                  </label>
                  <input
                    type="date"
                    name="start_date"
                    value={campaign.createdDate}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-300 focus:border-transparent"
                    required
                    disabled
                  />
                  <p className="text-xs text-gray-500 mt-1">Start date cannot be changed</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="h-4 w-4 inline mr-1" />
                    End Date *
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    onBlur={calculateDaysLeft}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-300 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              {/* Donation Types */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Accepted Donation Types *
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {donationTypeOptions.map((option) => (
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
                        onChange={() => handleDonationTypeChange(option.value)}
                        className="hidden"
                      />
                      <span className="text-sm font-medium text-gray-700">
                        {option.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Campaign Image
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  {imagePreview ? (
                    <div className="space-y-4">
                      <img 
                        src={imagePreview} 
                        alt="Campaign preview" 
                        className="mx-auto h-32 w-32 object-cover rounded-lg"
                      />
                      <div className="flex gap-2 justify-center">
                        <label className="bg-rose-500 text-white px-4 py-2 rounded-lg hover:bg-rose-600 transition cursor-pointer text-sm">
                          <Upload className="h-4 w-4 inline mr-1" />
                          Change Image
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                          />
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            setImagePreview(null);
                            setImageFile(null);
                          }}
                          className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition text-sm"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <Image className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600 mb-2">Upload a campaign image</p>
                      <p className="text-sm text-gray-500 mb-4">PNG, JPG, GIF up to 10MB</p>
                      <label className="bg-rose-500 text-white px-4 py-2 rounded-lg hover:bg-rose-600 transition cursor-pointer">
                        <Upload className="h-4 w-4 inline mr-1" />
                        Choose File
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </label>
                    </>
                  )}
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
              {formData.title ? (
                <>
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="font-bold text-lg text-gray-800">{formData.title}</h4>
                    <div className="flex items-center space-x-2">
                      {formData.is_emergency && (
                        <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded flex items-center">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Emergency
                        </span>
                      )}
                      {formData.label_right && (
                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                          {formData.label_right}
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4">{formData.description}</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
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
                  {formData.donationTypes.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.donationTypes.map(type => (
                        <div key={type} className="bg-gray-100 px-3 py-1 rounded-full">
                          <span className="text-xs text-gray-600 capitalize">
                            {type.replace('-', ' ')}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <p className="text-gray-500 text-center">Fill out the form to see preview</p>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}