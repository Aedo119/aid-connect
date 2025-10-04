import { useState } from "react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import { 
  Heart, 
  DollarSign, 
  Package, 
  Shirt, 
  Cross,
  TrendingUp,
  Clock,
  Users,
  Download,
  Edit3,
  Bell,
  ChevronRight,
  Award,
  Calendar,
  MapPin
} from 'lucide-react';

// Mock data
const userData = {
  name: "Jane Smith",
  email: "joannasara.jipson2006@gmail.com",
  totalDonated: 525,
  campaignsSupported: 4,
  impactScore: 87,
  donationRange: "$50 - $200",
  preferredCauses: ["Environment", "Education"],
  donationTypes: ["Money", "Clothes"]
};

const campaigns = [
  {
    id: 1,
    title: "Emergency Food Relief for Earthquake Victims",
    description: "Providing immediate food assistance to families affected by the recent earthquake.",
    organization: "Global Relief Foundation",
    raised: 32000,
    goal: 50000,
    donors: 24,
    daysLeft: 12,
    category: "Emergency",
    type: "Emergency Relief",
    donationTypes: ["Money", "Food"],
    progress: 64,
    urgent: true
  },
  {
    id: 2,
    title: "Climate Action: Reforestation Initiative",
    description: "Planting trees to combat climate change and restore natural habitats.",
    organization: "Green Future Initiative",
    raised: 18800,
    goal: 30000,
    donors: 42,
    daysLeft: 22,
    category: "Environment",
    type: "Reforestation",
    donationTypes: ["Money"],
    progress: 62
  },
  {
    id: 3,
    title: "School Supplies for Remote Learning",
    description: "Providing laptops and learning materials for students in underserved areas.",
    organization: "Education First",
    raised: 8800,
    goal: 15000,
    donors: 67,
    daysLeft: 36,
    category: "Education",
    type: "Educational Support",
    donationTypes: ["Money", "Clothes"],
    progress: 59
  }
];

const donationHistory = [
  {
    id: 1,
    title: "Clean Water Initiative for Remote Villages",
    description: "Helped provide clean water for 15 families",
    date: "1/15/2025",
    type: "Money",
    amount: 150,
    status: "Completed"
  },
  {
    id: 2,
    title: "Winter Clothing Drive",
    description: "Provided warm clothing for 5 children",
    date: "12/28/2024",
    type: "Clothes",
    amount: 75,
    status: "Completed"
  },
  {
    id: 3,
    title: "Emergency Medical Supplies",
    description: "Supported medical care for 25 patients",
    date: "12/10/2024",
    type: "Money",
    amount: 200,
    status: "Completed"
  },
  {
    id: 4,
    title: "Food Bank Support",
    description: "Provided meals for 30 families",
    date: "11/22/2024",
    type: "Food",
    amount: 100,
    status: "Completed"
  }
];

const DonationIcon = ({ type }) => {
  const iconMap = {
    Money: <DollarSign className="h-4 w-4 text-green-600" />,
    Food: <Package className="h-4 w-4 text-yellow-600" />,
    Clothes: <Shirt className="h-4 w-4 text-blue-600" />,
    "Medical Supplies": <Cross className="h-4 w-4 text-red-600" />,
  };
  return iconMap[type] || <DollarSign className="h-4 w-4 text-gray-600" />;
};

export default function DonorDashboard() {
  const [activeTab, setActiveTab] = useState("personalized");
  const [selectedDonationTypes, setSelectedDonationTypes] = useState({});

  const handleDonationTypeClick = (campaignId, donationType) => {
    setSelectedDonationTypes(prev => ({
      ...prev,
      [campaignId]: donationType
    }));
  };

  const renderPersonalizedFeed = () => (
    <div className="space-y-6">
      {/* Emergency Alert */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-red-800">Urgent: Emergency Campaigns Need Support</h3>
            <p className="text-red-600 text-sm mt-1">
              2 emergency campaigns matching your preferences require immediate assistance.
            </p>
          </div>
          <Link 
            to="/campaigns?filter=emergency"
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
          >
            View Emergency Campaigns
          </Link>
        </div>
      </div>

      {/* Recommended Section */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Recommended for You</h3>
        <div className="space-y-6">
          {campaigns.map((campaign) => {
            const selectedType = selectedDonationTypes[campaign.id] || campaign.donationTypes[0];
            
            return (
              <div key={campaign.id} className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
                {/* Campaign Header */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      {campaign.urgent && (
                        <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-medium">
                          Emergency
                        </span>
                      )}
                      <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs font-medium">
                        {campaign.type}
                      </span>
                    </div>
                    <h4 className="text-xl font-semibold text-gray-800">{campaign.title}</h4>
                    <p className="text-gray-600 mt-1">{campaign.description}</p>
                    <p className="text-sm text-gray-500 mt-2">
                      by <span className="font-medium text-gray-700">{campaign.organization}</span>
                    </p>
                  </div>
                </div>

                {/* Progress Stats */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-semibold">${campaign.raised.toLocaleString()} raised</span>
                      <span className="text-gray-600">Goal: ${campaign.goal.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-rose-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${campaign.progress}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-600">
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        <span>{campaign.donors} donors</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{campaign.daysLeft} days left</span>
                      </div>
                    </div>
                  </div>

                  {/* Donation Types */}
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Choose donation type:</p>
                    <div className="flex flex-wrap gap-2">
                      {campaign.donationTypes.map((type) => (
                        <button
                          key={type}
                          onClick={() => handleDonationTypeClick(campaign.id, type)}
                          className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm transition-colors ${
                            selectedType === type
                              ? "bg-rose-100 text-rose-700 border border-rose-300"
                              : "bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200"
                          }`}
                        >
                          <DonationIcon type={type} />
                          <span>{type}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Donate Button */}
                  <Link
                    to={`/donation-confirmation/${campaign.id}/${selectedType.toLowerCase()}`}
                    className={`block text-center w-full py-3 rounded-lg font-medium transition-colors ${
                      campaign.urgent
                        ? "bg-red-600 text-white hover:bg-red-700"
                        : "bg-teal-500 text-white hover:bg-teal-600"
                    }`}
                  >
                    Donate Now
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderDonationHistory = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-800">Your Donation History</h3>
        <button className="flex items-center gap-2 text-rose-600 hover:text-rose-700 transition-colors">
          <Download className="h-4 w-4" />
          <span className="text-sm font-medium">Download Report</span>
        </button>
      </div>

      <div className="space-y-4">
        {donationHistory.map((donation) => (
          <div key={donation.id} className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h4 className="font-semibold text-gray-800">{donation.title}</h4>
                <p className="text-gray-600 text-sm mt-1">{donation.description}</p>
                <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {donation.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <DonationIcon type={donation.type} />
                    {donation.type}
                  </span>
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full">
                    {donation.status}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-rose-600">${donation.amount}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderProfilePreferences = () => (
    <div className="space-y-6">
      {/* Profile Information */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Profile Information</h3>
          <button className="flex items-center gap-2 text-rose-600 hover:text-rose-700 transition-colors">
            <Edit3 className="h-4 w-4" />
            <span className="text-sm font-medium">Edit Profile</span>
          </button>
        </div>
        <div className="space-y-3">
          <div>
            <p className="font-medium text-gray-800">{userData.name}</p>
            <p className="text-gray-600 text-sm">{userData.email}</p>
          </div>
          <button className="text-rose-600 hover:text-rose-700 text-sm font-medium">
            Contact Owner
          </button>
        </div>
      </div>

      {/* Donation Preferences */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Donation Preferences</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Causes</label>
            <div className="flex flex-wrap gap-2">
              {userData.preferredCauses.map((cause, index) => (
                <span
                  key={cause}
                  className="bg-rose-100 text-rose-700 px-3 py-1 rounded-full text-sm font-medium"
                >
                  {cause}
                </span>
              ))}
              <button className="text-rose-600 hover:text-rose-700 text-sm font-medium">
                + Add more
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Donation Range</label>
            <p className="text-gray-800 font-medium">{userData.donationRange} per donation</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Donation Types</label>
            <div className="flex flex-wrap gap-2">
              {userData.donationTypes.map((type) => (
                <span
                  key={type}
                  className="flex items-center gap-1 bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium"
                >
                  <DonationIcon type={type} />
                  {type}
                </span>
              ))}
              <button className="text-rose-600 hover:text-rose-700 text-sm font-medium">
                + Add more
              </button>
            </div>
          </div>
        </div>

        <button className="w-full mt-6 bg-rose-500 text-white py-3 rounded-lg hover:bg-rose-600 transition-colors font-medium">
          Update Preferences
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br  from-yellow-100 via-teal-500 via-rose-300 to-rose-500">
      {/* Header */}
      <div >
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Welcome back, {userData.name}!</h1>
              <p className="text-gray-600 mt-1">Continue making a difference with your generous support</p>
            </div>
            <div className="flex items-center gap-4">
              <Bell className="h-6 w-6 text-white cursor-pointer hover:text-gray-600" />
              <div className="w-8 h-8 bg-rose-500 rounded-full flex items-center justify-center text-white font-semibold">
                {userData.name.charAt(0)}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Stats */}
          <div className="lg:col-span-1 space-y-6">
            {/* Stats Cards */}
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
              <div className="space-y-6">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <DollarSign className="h-6 w-6 text-rose-500" />
                    <h3 className="text-lg font-semibold text-gray-800">Total Donated</h3>
                  </div>
                  <p className="text-3xl font-bold text-rose-600">${userData.totalDonated}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Award className="h-4 w-4 text-teal-500" />
                      <h4 className="text-sm font-medium text-gray-700">Campaigns</h4>
                    </div>
                    <p className="text-xl font-bold text-gray-800">{userData.campaignsSupported}</p>
                  </div>

                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      <h4 className="text-sm font-medium text-gray-700">Impact Score</h4>
                    </div>
                    <p className="text-xl font-bold text-gray-800">{userData.impactScore}%</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4">
              <nav className="space-y-2">
                {[
                  { id: "personalized", label: "Personalized Feed", icon: Heart },
                  { id: "history", label: "Donation History", icon: Clock },
                  { id: "profile", label: "Profile & Preferences", icon: Users },
                ].map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                        activeTab === tab.id
                          ? "bg-rose-50 text-rose-700 border border-rose-200"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="h-4 w-4" />
                        <span className="font-medium">{tab.label}</span>
                      </div>
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === "personalized" && renderPersonalizedFeed()}
            {activeTab === "history" && renderDonationHistory()}
            {activeTab === "profile" && renderProfilePreferences()}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}