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
  Cross,
  PieChart,
  BarChart,
  Calendar,
  Download
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
  },
  {
    id: 3,
    title: "Educational Support for Underprivileged Children",
    description: "Providing school supplies, books, and educational resources to children in need.",
    progress: 74,
    raised: 18500,
    goal: 25000,
    donors: 156,
    status: "Completed",
    type: "Education",
    donationTypes: ["money", "clothes"],
    createdDate: "2025-07-20",
    endDate: "2025-08-28"
  },
  {    id: 4,
    title: "Healthcare Access for Rural Communities",
    description: "Setting up mobile clinics to provide essential healthcare services.", 
    progress: 100,
    raised: 60000,
    goal: 60000,
    donors: 300,
    status: "Completed",
    type: "Health",
    donationTypes: ["money", "medical-supplies"],
    createdDate: "2025-06-10",
    endDate: "2025-07-30"
  }
];

const mockDonations = [
  { id: 1, donor: "John Smith", amount: 100, type: "money", date: "2025-08-15", campaign: "Emergency Food Relief" },
  { id: 2, donor: "Sarah Johnson", amount: 50, type: "money", date: "2025-08-14", campaign: "Clean Water Initiative" },
  { id: 3, donor: "Michael Brown", items: "Rice, Canned Goods", type: "food", date: "2025-08-13", campaign: "Emergency Food Relief" },
  { id: 4, donor: "Community Health Center", items: "Medical Supplies", type: "medical-supplies", date: "2025-08-12", campaign: "Clean Water Initiative" },
  { id: 5, donor: "Emma Wilson", amount: 250, type: "money", date: "2025-08-11", campaign: "Emergency Food Relief" },
  { id: 6, donor: "Robert Davis", amount: 500, type: "money", date: "2025-08-10", campaign: "Educational Support" },
  { id: 7, donor: "Local School", items: "Books, Notebooks", type: "clothes", date: "2025-08-09", campaign: "Educational Support" },
  { id: 8, donor: "Jennifer Lee", amount: 75, type: "money", date: "2025-08-08", campaign: "Clean Water Initiative" }
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
  const [analytics, setAnalytics] = useState({
    donationTypes: [],
    campaignPerformance: [],
    monthlyTrends: [],
    donorDistribution: []
  });
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would fetch data from your API
    const fetchData = async () => {
      try {
        // Simulate API call
        setTimeout(() => {
          setCampaigns(mockCampaigns);
          setDonations(mockDonations);
          
          // Calculate stats
          const activeCampaigns = mockCampaigns.filter(c => c.status === "Active").length;
          const totalRaised = mockCampaigns.reduce((sum, campaign) => sum + campaign.raised, 0);
          const totalDonors = mockCampaigns.reduce((sum, campaign) => sum + campaign.donors, 0);
          const completedCampaigns = mockCampaigns.filter(c => c.status === "Completed") ;
          const successRate = completedCampaigns.length > 0 
            ? Math.round((completedCampaigns.filter(c => c.raised >= c.goal).length / completedCampaigns.length) * 100)
            : 0;
          
          setStats({
            activeCampaigns,
            totalRaised,
            totalDonors,
            successRate
          });
          
          // Generate analytics
          generateAnalytics(mockCampaigns, mockDonations);
          
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const generateAnalytics = (campaignsData, donationsData) => {
    // Donation type distribution
    const donationTypeCount = {};
    donationsData.forEach(donation => {
      donationTypeCount[donation.type] = (donationTypeCount[donation.type] || 0) + 1;
    });
    
    const donationTypes = Object.keys(donationTypeCount).map(type => ({
      type,
      count: donationTypeCount[type],
      percentage: Math.round((donationTypeCount[type] / donationsData.length) * 100)
    }));
    
    // Campaign performance
    const campaignPerformance = campaignsData.map(campaign => ({
      name: campaign.title,
      raised: campaign.raised,
      goal: campaign.goal,
      completion: Math.round((campaign.raised / campaign.goal) * 100),
      donors: campaign.donors
    }));
    
    // Monthly trends (simplified)
    const monthlyTrends = [
      { month: 'Jun', amount: 12000 },
      { month: 'Jul', amount: 25000 },
      { month: 'Aug', amount: 58500 }
    ];
    
    // Donor distribution (by donation size)
    const monetaryDonations = donationsData.filter(d => d.amount);
    const donorDistribution = [
      { range: '$1-50', count: monetaryDonations.filter(d => d.amount <= 50).length },
      { range: '$51-100', count: monetaryDonations.filter(d => d.amount > 50 && d.amount <= 100).length },
      { range: '$101-250', count: monetaryDonations.filter(d => d.amount > 100 && d.amount <= 250).length },
      { range: '$251+', count: monetaryDonations.filter(d => d.amount > 250).length }
    ];
    
    setAnalytics({
      donationTypes,
      campaignPerformance,
      monthlyTrends,
      donorDistribution
    });
  };

  const handleLogout = async () => {
    try {
      await orgLogout();
      navigate("/");
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  const handleCreateCampaign = () => {
    navigate("/new-campaign");
  };

  const handleEditCampaign = (id) => {
  const campaign = campaigns.find(c => c.id === id);
  navigate(`/edit-campaign/${id}`, { state: { campaign } });
};


  const handleDeleteCampaign = async (id) => {
  if (!window.confirm("Are you sure you want to delete this campaign?")) return;

  try {
    // Simulate API call
    // await fetch(`/api/campaigns/${id}`, { method: "DELETE" });

    setCampaigns(prev => prev.filter(c => c.id !== id));
  } catch (error) {
    console.error("Failed to delete campaign", error);
    alert("Failed to delete campaign. Please try again.");
  }
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

  const exportReports = () => {
  // Prepare CSV content
  let csv = "Campaign Title,Description,Raised,Goal,Donors,Status,Type\n";
  campaigns.forEach(c => {
    csv += `"${c.title}","${c.description}",${c.raised},${c.goal},${c.donors},${c.status},${c.type}\n`;
  });

  csv += "\nDonations:\n";
  csv += "Donor,Type,Amount/Items,Date,Campaign\n";
  donations.forEach(d => {
    csv += `"${d.donor}",${d.type},"${d.amount || d.items}",${d.date},"${d.campaign}"\n`;
  });

  // Convert to Blob and trigger download
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "ngo_reports.csv";
  link.click();
  URL.revokeObjectURL(url);
};



  const renderAnalyticsView = () => {
    return (
      <div className="bg-white/90 backdrop-blur-md rounded-xl p-6 shadow-lg mb-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-800">Campaign Analytics</h3>
          <button
            onClick={() => setShowAnalytics(false)}
            className="text-rose-500 hover:text-rose-700 font-medium"
          >
            Back to Dashboard
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Donation Type Distribution */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
              <PieChart className="h-5 w-5 mr-2 text-blue-500" />
              Donation Types
            </h4>
            <div className="space-y-2">
              {analytics.donationTypes.map(item => (
                <div key={item.type} className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 capitalize">{item.type.replace('-', ' ')}</span>
                  <div className="flex items-center">
                    <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                      <div 
                        className="h-2 rounded-full bg-rose-500" 
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-xs font-medium text-gray-700">{item.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Monthly Trends */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
              <BarChart className="h-5 w-5 mr-2 text-green-500" />
              Monthly Trends
            </h4>
            <div className="space-y-2">
              {analytics.monthlyTrends.map(item => (
                <div key={item.month} className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">{item.month}</span>
                  <span className="text-sm font-medium text-gray-700">${item.amount.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Campaign Performance */}
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-purple-500" />
            Campaign Performance
          </h4>
          <div className="space-y-3">
            {analytics.campaignPerformance.map(campaign => (
              <div key={campaign.name} className="border-b border-gray-200 pb-2 last:border-0">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gray-700">{campaign.name}</span>
                  <span className="text-sm font-medium text-gray-700">{campaign.completion}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
                  <div 
                    className="h-2 rounded-full bg-rose-500" 
                    style={{ width: `${campaign.completion}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>${campaign.raised.toLocaleString()} raised</span>
                  <span>{campaign.donors} donors</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Donor Distribution */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
            <Users className="h-5 w-5 mr-2 text-amber-500" />
            Donor Distribution by Amount
          </h4>
          <div className="grid grid-cols-2 gap-4">
            {analytics.donorDistribution.map(item => (
              <div key={item.range} className="text-center p-3 bg-white rounded-lg shadow-sm">
                <div className="text-lg font-bold text-rose-500">{item.count}</div>
                <div className="text-xs text-gray-600">{item.range}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
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

          {showAnalytics ? (
            renderAnalyticsView()
          ) : (
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
                              <span className={`text-xs px-2 py-1 rounded ${
                                campaign.status === "Active" 
                                  ? "bg-green-100 text-green-800" 
                                  : "bg-gray-100 text-gray-800"
                              }`}>
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
                    <button 
                      onClick={handleCreateCampaign}
                      className="w-full bg-rose-500 text-white py-2 rounded-lg hover:bg-rose-600 transition flex items-center justify-center"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Create Campaign
                    </button>
                    <button 
                      onClick={() => setShowAnalytics(true)}
                      className="w-full border border-rose-500 text-rose-500 py-2 rounded-lg hover:bg-rose-50 transition flex items-center justify-center"
                    >
                      <BarChart3 className="h-4 w-4 mr-2" />
                      View Analytics
                    </button>
                    <button 
                      onClick={exportReports}
                      className="w-full border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-100 transition flex items-center justify-center"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Export Reports
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}