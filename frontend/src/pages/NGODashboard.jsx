// src/pages/NGODashboard.jsx
import { useState, useEffect } from "react";
import { 
  BarChart3, 
  Users, 
  DollarSign, 
  TrendingUp, 
  Plus,
  Edit,
  Trash2,
  Heart,
  Package,
  Shirt,
  Apple,
  Cross
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";

// Mock data - replace with actual API calls
const mockCampaigns = [
  {
    id: 1,
    title: "Emergency Food Relief for Earthquake Victims",
    description: "Providing immediate food assistance to families affected by the recent earthquake.",
    progress: 64,
    raised: 32000,
    goal: 50000,
    donors: 245,
    status: "Active",
    type: "Emergency",
    donationTypes: ["money", "food"],
    createdDate: "2025-08-01",
    endDate: "2025-08-25"
  },
  {
    id: 2,
    title: "Clean Water Initiative for Remote Villages",
    description: "Building wells and water filtration systems to provide clean drinking water.",
    progress: 60,
    raised: 45000,
    goal: 75000,
    donors: 189,
    status: "Active",
    type: "Water & Sanitation",
    donationTypes: ["money", "medical-supplies"],
    createdDate: "2025-07-15",
    endDate: "2025-08-30"
  }
];

const mockDonations = [
  { id: 1, donor: "John Smith", amount: 100, type: "money", date: "2025-08-15", campaign: "Emergency Food Relief" },
  { id: 2, donor: "Sarah Johnson", amount: 50, type: "money", date: "2025-08-14", campaign: "Clean Water Initiative" },
  { id: 3, donor: "Michael Brown", items: "Rice, Canned Goods", type: "food", date: "2025-08-13", campaign: "Emergency Food Relief" },
  { id: 4, donor: "Community Health Center", items: "Medical Supplies", type: "medical-supplies", date: "2025-08-12", campaign: "Clean Water Initiative" },
  { id: 5, donor: "Emma Wilson", amount: 250, type: "money", date: "2025-08-11", campaign: "Emergency Food Relief" }
];

export default function NGODashboard() {
  const { currentUser, orgLogout } = useAuth();
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState([]);
  const [donations, setDonations] = useState([]);
  const [stats, setStats] = useState({
    activeCampaigns: 0,
    totalRaised: 0,
    totalDonors: 0,
    successRate: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would fetch data from your API
    const fetchData = async () => {
      try {
        // Simulate API call
        setTimeout(() => {
          setCampaigns(mockCampaigns);
          setDonations(mockDonations);
          setStats({
            activeCampaigns: mockCampaigns.length,
            totalRaised: mockCampaigns.reduce((sum, campaign) => sum + campaign.raised, 0),
            totalDonors: mockCampaigns.reduce((sum, campaign) => sum + campaign.donors, 0),
            successRate: 87 // This would be calculated based on your business logic
          });
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLogout = async () => {
    try {
      await orgLogout();
      navigate("/");
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  const handleCreateCampaign = () => {
    navigate("/create-campaign");
  };

  const handleEditCampaign = (id) => {
    navigate(`/edit-campaign/${id}`);
  };

  const handleDeleteCampaign = (id) => {
    // In a real app, this would call an API
    setCampaigns(campaigns.filter(campaign => campaign.id !== id));
  };

  const getDonationTypeIcon = (type) => {
    switch(type) {
      case 'money': return <DollarSign className="h-4 w-4 text-blue-500" />;
      case 'food': return <Apple className="h-4 w-4 text-green-500" />;
      case 'clothes': return <Shirt className="h-4 w-4 text-orange-500" />;
      case 'medical supplies': return <Cross className="h-4 w-4 text-red-500" />;
      default: return <Package className="h-4 w-4 text-gray-500" />;
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

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-green-200 via-teal-400 to-rose-400">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Heart className="h-8 w-8 text-rose-500 fill-rose-500 mr-2" />
              <h1 className="text-2xl font-bold text-gray-800">NGO Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {currentUser?.name || "NGO Admin"}</span>
              <button
                onClick={handleLogout}
                className="bg-rose-500 text-white px-4 py-2 rounded-lg hover:bg-rose-600 transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Manage your campaigns and track your impact</h2>
            <p className="text-gray-600">Overview of your organization's performance and activities</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white/90 backdrop-blur-md rounded-xl p-6 shadow-lg">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-lg mr-4">
                  <BarChart3 className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Active Campaigns</p>
                  <p className="text-2xl font-bold text-gray-800">{stats.activeCampaigns}</p>
                </div>
              </div>
            </div>

            <div className="bg-white/90 backdrop-blur-md rounded-xl p-6 shadow-lg">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-lg mr-4">
                  <DollarSign className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Raised</p>
                  <p className="text-2xl font-bold text-gray-800">${stats.totalRaised.toLocaleString()}</p>
                </div>
              </div>
            </div>

            <div className="bg-white/90 backdrop-blur-md rounded-xl p-6 shadow-lg">
              <div className="flex items-center">
                <div className="p-3 bg-purple-100 rounded-lg mr-4">
                  <Users className="h-6 w-6 text-purple-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Donors</p>
                  <p className="text-2xl font-bold text-gray-800">{stats.totalDonors}</p>
                </div>
              </div>
            </div>

            <div className="bg-white/90 backdrop-blur-md rounded-xl p-6 shadow-lg">
              <div className="flex items-center">
                <div className="p-3 bg-amber-100 rounded-lg mr-4">
                  <TrendingUp className="h-6 w-6 text-amber-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Success Rate</p>
                  <p className="text-2xl font-bold text-gray-800">{stats.successRate}%</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Campaigns Section */}
            <div className="lg:col-span-2">
              <div className="bg-white/90 backdrop-blur-md rounded-xl p-6 shadow-lg mb-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-gray-800">My Campaigns</h3>
                  <button
                    onClick={handleCreateCampaign}
                    className="bg-rose-500 text-white px-4 py-2 rounded-lg hover:bg-rose-600 transition flex items-center"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Create Campaign
                  </button>
                </div>

                <div className="space-y-6">
                  {campaigns.map(campaign => (
                    <div key={campaign.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-bold text-gray-800">{campaign.title}</h4>
                          <div className="flex items-center mt-1">
                            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mr-2">
                              {campaign.type}
                            </span>
                            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                              {campaign.status}
                            </span>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditCampaign(campaign.id)}
                            className="text-blue-500 hover:text-blue-700"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteCampaign(campaign.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      
                      <p className="text-gray-600 text-sm mb-4">{campaign.description}</p>
                      
                      <div className="mb-3">
                        <div className="flex justify-between text-sm text-gray-600 mb-1">
                          <span>Progress</span>
                          <span>{campaign.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="h-2 rounded-full bg-rose-500"
                            style={{ width: `${campaign.progress}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>${campaign.raised.toLocaleString()} raised</span>
                          <span>Goal: ${campaign.goal.toLocaleString()}</span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <Users className="h-4 w-4 text-gray-500 mr-1" />
                          <span className="text-sm text-gray-600">{campaign.donors} donors</span>
                        </div>
                        <div className="flex space-x-1">
                          {campaign.donationTypes.map(type => (
                            <div key={type} className="flex items-center bg-gray-100 px-2 py-1 rounded">
                              {getDonationTypeIcon(type)}
                              <span className="text-xs text-gray-600 ml-1 capitalize">
                                {type.replace('-', ' ')}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Donations Section */}
            <div>
              <div className="bg-white/90 backdrop-blur-md rounded-xl p-6 shadow-lg mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Recent Donations</h3>
                
                <div className="space-y-4">
                  {donations.map(donation => (
                    <div key={donation.id} className="border border-gray-200 rounded-lg p-3">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-medium text-gray-800">{donation.donor}</span>
                        <span className="text-sm text-gray-500">{donation.date}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          {getDonationTypeIcon(donation.type)}
                          <span className="text-sm text-gray-600 ml-1">
                            {donation.amount ? `$${donation.amount}` : donation.items}
                          </span>
                        </div>
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                          {donation.campaign}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white/90 backdrop-blur-md rounded-xl p-6 shadow-lg">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h3>
                
                <div className="space-y-3">
                  <button className="w-full bg-rose-500 text-white py-2 rounded-lg hover:bg-rose-600 transition flex items-center justify-center">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Campaign
                  </button>
                  <button className="w-full border border-rose-500 text-rose-500 py-2 rounded-lg hover:bg-rose-50 transition">
                    View Analytics
                  </button>
                  <button className="w-full border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-100 transition">
                    Export Reports
                  </button>
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