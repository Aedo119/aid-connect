import { useState } from "react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import api from "../API/api";
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
  MapPin,
  Eye,
  Receipt,
  Save,
  X,
  Plus,
  Trash2,
} from "lucide-react";

import { useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

// Mock data
const initialUserData = {
  name: "Jane Smith",
  email: "joannasara.jipson2006@gmail.com",
  phone: "+1 (555) 123-4567",
  address: "123 Main Street, City, State 12345",
  totalDonated: 525,
  campaignsSupported: 4,
  impactScore: 87,
  donationRange: "$50 - $200",
  preferredCauses: ["Environment", "Education"],
  donationTypes: ["Money", "Clothes"],
};

const availableCauses = [
  "Environment",
  "Education",
  "Healthcare",
  "Poverty Alleviation",
  "Disaster Relief",
  "Animal Welfare",
  "Arts & Culture",
  "Human Rights",
];

const availableDonationTypes = ["Money", "Food", "Clothes", "Medical Supplies"];

const donationRanges = [
  "$10 - $50",
  "$50 - $200",
  "$200 - $500",
  "$500 - $1000",
  "$1000+",
];

const campaigns = [
  {
    id: 1,
    title: "Emergency Food Relief for Earthquake Victims",
    description:
      "Providing immediate food assistance to families affected by the recent earthquake.",
    organization: "Global Relief Foundation",
    raised: 32000,
    goal: 50000,
    donors: 24,
    daysLeft: 12,
    category: "Emergency",
    type: "Emergency Relief",
    donationTypes: ["Money", "Food"],
    progress: 64,
    urgent: true,
  },
  {
    id: 2,
    title: "Climate Action: Reforestation Initiative",
    description:
      "Planting trees to combat climate change and restore natural habitats.",
    organization: "Green Future Initiative",
    raised: 18800,
    goal: 30000,
    donors: 42,
    daysLeft: 22,
    category: "Environment",
    type: "Reforestation",
    donationTypes: ["Money"],
    progress: 62,
  },
  {
    id: 3,
    title: "School Supplies for Remote Learning",
    description:
      "Providing laptops and learning materials for students in underserved areas.",
    organization: "Education First",
    raised: 8800,
    goal: 15000,
    donors: 67,
    daysLeft: 36,
    category: "Education",
    type: "Educational Support",
    donationTypes: ["Money", "Clothes"],
    progress: 59,
  },
  {
    id: 4,
    title: "Hurricane Relief Fund",
    description:
      "Emergency aid for communities affected by the recent hurricane.",
    organization: "Disaster Response Team",
    raised: 45000,
    goal: 75000,
    donors: 89,
    daysLeft: 5,
    category: "Emergency",
    type: "Emergency Relief",
    donationTypes: ["Money", "Clothes", "Food"],
    progress: 60,
    urgent: true,
  },
];

const donationHistory1 = [
  {
    id: 1,
    title: "Clean Water Initiative for Remote Villages",
    description: "Helped provide clean water for 15 families",
    date: "1/15/2025",
    type: "Money",
    amount: 150,
    status: "Completed",
    reference: "CW20250115JS",
    campaignId: 5,
  },
  {
    id: 2,
    title: "Winter Clothing Drive",
    description: "Provided warm clothing for 5 children",
    date: "12/28/2024",
    type: "Clothes",
    amount: 75,
    status: "Completed",
    reference: "WC20241228JS",
    campaignId: 6,
  },
  {
    id: 3,
    title: "Emergency Medical Supplies",
    description: "Supported medical care for 25 patients",
    date: "12/10/2024",
    type: "Money",
    amount: 200,
    status: "Completed",
    reference: "MS20241210JS",
    campaignId: 7,
  },
  {
    id: 4,
    title: "Food Bank Support",
    description: "Provided meals for 30 families",
    date: "11/22/2024",
    type: "Food",
    amount: 100,
    status: "Completed",
    reference: "FB20241122JS",
    campaignId: 8,
  },
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
  const navigate = useNavigate();
  const [selectedDonationTypes, setSelectedDonationTypes] = useState({});
  const { user } = useAuth();
  const [donationHistory, setHistory] = useState([]);

  useEffect(() => {
    console.log("user.type", user.type);
    if (!user || user.type != "donor") {
      navigate("/donor-login");
    }

    const fetchHistory = async () => {
      try {
        const result = await api.get(`/donations/user/${user.id}`);
        setHistory(result.data.donations);
      } catch (err) {
        console.log(err);
      }
    };

    fetchHistory();
  }, [user]);

  const [showEmergencyOnly, setShowEmergencyOnly] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [userData, setUserData] = useState(initialUserData);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingPreferences, setIsEditingPreferences] = useState(false);
  const [profileForm, setProfileForm] = useState(initialUserData);
  const [preferencesForm, setPreferencesForm] = useState({
    preferredCauses: initialUserData.preferredCauses,
    donationRange: initialUserData.donationRange,
    donationTypes: initialUserData.donationTypes,
  });
  const [newCause, setNewCause] = useState("");
  const [showCauseDropdown, setShowCauseDropdown] = useState(false);

  // Profile editing functions
  const handleEditProfile = () => {
    setProfileForm(userData);
    setIsEditingProfile(true);
  };

  const handleSaveProfile = () => {
    setUserData(profileForm);
    setIsEditingProfile(false);
    // Here you would typically make an API call to save the profile
  };

  const handleCancelEditProfile = () => {
    setProfileForm(userData);
    setIsEditingProfile(false);
  };

  const handleProfileChange = (field, value) => {
    setProfileForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Preferences editing functions
  const handleEditPreferences = () => {
    setPreferencesForm({
      preferredCauses: userData.preferredCauses,
      donationRange: userData.donationRange,
      donationTypes: userData.donationTypes,
    });
    setIsEditingPreferences(true);
  };

  const handleSavePreferences = () => {
    setUserData((prev) => ({
      ...prev,
      ...preferencesForm,
    }));
    setIsEditingPreferences(false);
    // Here you would typically make an API call to save the preferences
  };

  const handleCancelEditPreferences = () => {
    setPreferencesForm({
      preferredCauses: userData.preferredCauses,
      donationRange: userData.donationRange,
      donationTypes: userData.donationTypes,
    });
    setIsEditingPreferences(false);
  };

  const handleAddCause = (cause) => {
    if (!preferencesForm.preferredCauses.includes(cause)) {
      setPreferencesForm((prev) => ({
        ...prev,
        preferredCauses: [...prev.preferredCauses, cause],
      }));
    }
    setNewCause("");
    setShowCauseDropdown(false);
  };

  const handleRemoveCause = (causeToRemove) => {
    setPreferencesForm((prev) => ({
      ...prev,
      preferredCauses: prev.preferredCauses.filter(
        (cause) => cause !== causeToRemove
      ),
    }));
  };

  const handleAddDonationType = (type) => {
    if (!preferencesForm.donationTypes.includes(type)) {
      setPreferencesForm((prev) => ({
        ...prev,
        donationTypes: [...prev.donationTypes, type],
      }));
    }
  };

  const handleRemoveDonationType = (typeToRemove) => {
    setPreferencesForm((prev) => ({
      ...prev,
      donationTypes: prev.donationTypes.filter((type) => type !== typeToRemove),
    }));
  };

  const handleDonationTypeClick = (campaignId, donationType) => {
    setSelectedDonationTypes((prev) => ({
      ...prev,
      [campaignId]: donationType,
    }));
  };

  const handleViewEmergencyCampaigns = () => {
    setShowEmergencyOnly(true);
  };

  const handleShowAllCampaigns = () => {
    setShowEmergencyOnly(false);
  };

  // Generate receipt content for a donation
  const generateReceiptContent = (donation) => {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Donation Receipt - ${donation.reference}</title>
        <style>
          body { 
            font-family: Arial, sans-serif; 
            margin: 40px; 
            color: #333;
            line-height: 1.6;
          }
          .header { 
            text-align: center; 
            border-bottom: 2px solid #e11d48; 
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          .logo { 
            font-size: 24px; 
            font-weight: bold; 
            color: #e11d48; 
            margin-bottom: 10px;
          }
          .receipt-title { 
            font-size: 28px; 
            margin: 10px 0; 
            color: #1f2937;
          }
          .reference { 
            font-size: 16px; 
            color: #6b7280; 
            margin-bottom: 20px;
          }
          .section { 
            margin: 25px 0; 
          }
          .section-title { 
            font-size: 18px; 
            font-weight: bold; 
            color: #e11d48; 
            margin-bottom: 10px;
            border-bottom: 1px solid #e5e7eb;
            padding-bottom: 5px;
          }
          .info-grid { 
            display: grid; 
            grid-template-columns: 1fr 1fr; 
            gap: 15px; 
          }
          .info-item { 
            margin: 8px 0; 
          }
          .label { 
            font-weight: bold; 
            color: #4b5563; 
          }
          .value { 
            color: #1f2937; 
          }
          .footer { 
            margin-top: 40px; 
            text-align: center; 
            color: #6b7280; 
            font-size: 14px;
            border-top: 1px solid #e5e7eb;
            padding-top: 20px;
          }
          .thank-you {
            text-align: center;
            font-size: 18px;
            color: #059669;
            margin: 30px 0;
            font-weight: bold;
          }
          .donation-details {
            background: #f8fafc;
            padding: 20px;
            border-radius: 8px;
            margin: 15px 0;
          }
          .amount {
            font-size: 24px;
            font-weight: bold;
            color: #e11d48;
            text-align: center;
            margin: 20px 0;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">HopeBridge</div>
          <h1 class="receipt-title">DONATION RECEIPT</h1>
          <div class="reference">Reference ID: ${donation.reference}</div>
          <div>Date: ${donation.date} | Time: 14:30 PM</div>
        </div>

        <div class="section">
          <div class="section-title">Donor Information</div>
          <div class="info-grid">
            <div class="info-item">
              <span class="label">Name:</span><br>
              <span class="value">${userData.name}</span>
            </div>
            <div class="info-item">
              <span class="label">Email:</span><br>
              <span class="value">${userData.email}</span>
            </div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Donation Details</div>
          <div class="donation-details">
            <div class="info-grid">
              <div class="info-item">
                <span class="label">Campaign:</span><br>
                <span class="value">${donation.title}</span>
              </div>
              <div class="info-item">
                <span class="label">Date:</span><br>
                <span class="value">${donation.date}</span>
              </div>
              <div class="info-item">
                <span class="label">Donation Type:</span><br>
                <span class="value">${donation.type}</span>
              </div>
              <div class="info-item">
                <span class="label">Status:</span><br>
                <span class="value">${donation.status}</span>
              </div>
            </div>
            <div class="amount">$${donation.amount}</div>
            <div class="info-item">
              <span class="label">Description:</span><br>
              <span class="value">${donation.description}</span>
            </div>
          </div>
        </div>

        <div class="thank-you">
          Thank you for your generous donation!
        </div>

        <div class="footer">
          <p>HopeBridge Foundation</p>
          <p>123 Charity Street, Compassion City</p>
          <p>Email: contact@hopebridge.org | Phone: (555) 123-HELP</p>
          <p>This receipt is generated electronically and does not require a signature.</p>
        </div>
      </body>
      </html>
    `;
  };

  // Download individual receipt
  const downloadReceipt = (donation) => {
    const receiptContent = generateReceiptContent(donation);
    const blob = new Blob([receiptContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `donation-receipt-${donation.reference}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // View receipt in modal
  const viewReceipt = (donation) => {
    setSelectedReceipt(donation);
  };

  // Close receipt modal
  const closeReceipt = () => {
    setSelectedReceipt(null);
  };

  // Print receipt
  const printReceipt = (donation) => {
    const receiptContent = generateReceiptContent(donation);
    const printWindow = window.open("", "_blank");
    printWindow.document.write(receiptContent);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  // Generate and download full donation report
  const downloadDonationReport = () => {
    const reportContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Donation Report - ${userData.name}</title>
        <style>
          body { 
            font-family: Arial, sans-serif; 
            margin: 40px; 
            color: #333;
            line-height: 1.6;
          }
          .header { 
            text-align: center; 
            border-bottom: 2px solid #e11d48; 
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          .logo { 
            font-size: 24px; 
            font-weight: bold; 
            color: #e11d48; 
            margin-bottom: 10px;
          }
          .report-title { 
            font-size: 28px; 
            margin: 10px 0; 
            color: #1f2937;
          }
          .summary { 
            background: #f8fafc;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
          }
          .summary-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 20px;
            text-align: center;
          }
          .summary-item {
            padding: 15px;
          }
          .summary-value {
            font-size: 24px;
            font-weight: bold;
            color: #e11d48;
            margin-bottom: 5px;
          }
          .summary-label {
            font-size: 14px;
            color: #6b7280;
          }
          .section { 
            margin: 25px 0; 
          }
          .section-title { 
            font-size: 18px; 
            font-weight: bold; 
            color: #e11d48; 
            margin-bottom: 10px;
            border-bottom: 1px solid #e5e7eb;
            padding-bottom: 5px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
          }
          th, td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid #e5e7eb;
          }
          th {
            background: #f8fafc;
            font-weight: bold;
            color: #374151;
          }
          .footer { 
            margin-top: 40px; 
            text-align: center; 
            color: #6b7280; 
            font-size: 14px;
            border-top: 1px solid #e5e7eb;
            padding-top: 20px;
          }
          .total-row {
            font-weight: bold;
            background: #f0f9ff;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">HopeBridge</div>
          <h1 class="report-title">DONATION REPORT</h1>
          <div>Generated on: ${new Date().toLocaleDateString()}</div>
          <div>Donor: ${userData.name} (${userData.email})</div>
        </div>

        <div class="summary">
          <div class="summary-grid">
            <div class="summary-item">
              <div class="summary-value">$${userData.totalDonated}</div>
              <div class="summary-label">Total Donated</div>
            </div>
            <div class="summary-item">
              <div class="summary-value">${userData.campaignsSupported}</div>
              <div class="summary-label">Campaigns Supported</div>
            </div>
            <div class="summary-item">
              <div class="summary-value">${userData.impactScore}%</div>
              <div class="summary-label">Impact Score</div>
            </div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Donation History</div>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Campaign</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Reference</th>
              </tr>
            </thead>
            <tbody>
              ${donationHistory
                .map(
                  (donation) => `
                <tr>
                  <td>${donation.date}</td>
                  <td>${donation.title}</td>
                  <td>${donation.type}</td>
                  <td>$${donation.amount}</td>
                  <td>${donation.status}</td>
                  <td>${donation.reference}</td>
                </tr>
              `
                )
                .join("")}
              <tr class="total-row">
                <td colspan="3"><strong>Total</strong></td>
                <td><strong>$${userData.totalDonated}</strong></td>
                <td colspan="2"></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="section">
          <div class="section-title">Donation Preferences</div>
          <table>
            <tr>
              <td><strong>Preferred Causes:</strong></td>
              <td>${userData.preferredCauses.join(", ")}</td>
            </tr>
            <tr>
              <td><strong>Donation Range:</strong></td>
              <td>${userData.donationRange}</td>
            </tr>
            <tr>
              <td><strong>Donation Types:</strong></td>
              <td>${userData.donationTypes.join(", ")}</td>
            </tr>
          </table>
        </div>

        <div class="footer">
          <p>HopeBridge Foundation</p>
          <p>123 Charity Street, Compassion City</p>
          <p>Email: contact@hopebridge.org | Phone: (555) 123-HELP</p>
          <p>This report is generated electronically for your records.</p>
        </div>
      </body>
      </html>
    `;

    const blob = new Blob([reportContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `donation-report-${userData.name.replace(/\s+/g, "-")}-${
      new Date().toISOString().split("T")[0]
    }.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Filter campaigns based on emergency filter
  const filteredCampaigns = showEmergencyOnly
    ? campaigns.filter((campaign) => campaign.urgent)
    : campaigns;

  const renderPersonalizedFeed = () => (
    <div className="space-y-6">
      {/* Emergency Alert */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-red-800">
              Urgent: Emergency Campaigns Need Support
            </h3>
            <p className="text-red-600 text-sm mt-1">
              {campaigns.filter((camp) => camp.urgent).length} emergency
              campaigns matching your preferences require immediate assistance.
            </p>
          </div>
          {showEmergencyOnly ? (
            <button
              onClick={handleShowAllCampaigns}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
            >
              Show All Campaigns
            </button>
          ) : (
            <button
              onClick={handleViewEmergencyCampaigns}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
            >
              View Emergency Campaigns
            </button>
          )}
        </div>
      </div>

      {/* Filter Status */}
      {showEmergencyOnly && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
                Emergency Filter
              </span>
              <p className="text-blue-700 text-sm">
                Showing {filteredCampaigns.length} emergency campaign(s)
              </p>
            </div>
            <button
              onClick={handleShowAllCampaigns}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium underline"
            >
              Show all campaigns
            </button>
          </div>
        </div>
      )}

      {/* Recommended Section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">
            {showEmergencyOnly ? "Emergency Campaigns" : "Recommended for You"}
          </h3>
          {showEmergencyOnly && (
            <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium">
              {filteredCampaigns.length} urgent campaign(s)
            </span>
          )}
        </div>

        {filteredCampaigns.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-8 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="h-8 w-8 text-gray-400" />
              </div>
              <h4 className="text-lg font-semibold text-gray-800 mb-2">
                No Emergency Campaigns Available
              </h4>
              <p className="text-gray-600 mb-4">
                There are currently no emergency campaigns that match your
                preferences.
              </p>
              <button
                onClick={handleShowAllCampaigns}
                className="bg-rose-500 text-white px-6 py-2 rounded-lg hover:bg-rose-600 transition-colors font-medium"
              >
                View All Campaigns
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredCampaigns.map((campaign) => {
              const selectedType =
                selectedDonationTypes[campaign.id] || campaign.donationTypes[0];

              return (
                <div
                  key={campaign.id}
                  className="bg-white rounded-lg shadow-md border border-gray-200 p-6"
                >
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
                      <h4 className="text-xl font-semibold text-gray-800">
                        {campaign.title}
                      </h4>
                      <p className="text-gray-600 mt-1">
                        {campaign.description}
                      </p>
                      <p className="text-sm text-gray-500 mt-2">
                        by{" "}
                        <span className="font-medium text-gray-700">
                          {campaign.organization}
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Progress Stats */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-semibold">
                          ${campaign.raised.toLocaleString()} raised
                        </span>
                        <span className="text-gray-600">
                          Goal: ${campaign.goal.toLocaleString()}
                        </span>
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
                      <p className="text-sm font-medium text-gray-700 mb-2">
                        Choose donation type:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {campaign.donationTypes.map((type) => (
                          <button
                            key={type}
                            onClick={() =>
                              handleDonationTypeClick(campaign.id, type)
                            }
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
                      to={`/donation-confirmation/${
                        campaign.id
                      }/${selectedType.toLowerCase()}`}
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
        )}
      </div>
    </div>
  );

  const renderDonationHistory = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-800">
          Your Donation History
        </h3>
        <button
          onClick={downloadDonationReport}
          className="flex items-center gap-2 text-rose-600 hover:text-rose-700 transition-colors"
        >
          <Download className="h-4 w-4" />
          <span className="text-sm font-medium">Download Report</span>
        </button>
      </div>

      <div className="space-y-4">
        {donationHistory.map((donation) => (
          <div
            key={donation.id}
            className="bg-white rounded-lg border border-gray-200 p-4"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h4 className="font-semibold text-gray-800">
                  {donation.campaign_name}
                </h4>
                <p className="text-gray-600 text-sm mt-1">
                  {donation.campaign_desc}
                </p>
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
                <p className="text-lg font-bold text-rose-600">
                  ${donation.amount}
                </p>
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => viewReceipt(donation)}
                    className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm"
                  >
                    <Eye className="h-3 w-3" />
                    View
                  </button>
                  <button
                    onClick={() => downloadReceipt(donation)}
                    className="flex items-center gap-1 text-green-600 hover:text-green-700 text-sm"
                  >
                    <Download className="h-3 w-3" />
                    Download
                  </button>
                </div>
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
          <h3 className="text-lg font-semibold text-gray-800">
            Profile Information
          </h3>
          {!isEditingProfile ? (
            <button
              onClick={handleEditProfile}
              className="flex items-center gap-2 text-rose-600 hover:text-rose-700 transition-colors"
            >
              <Edit3 className="h-4 w-4" />
              <span className="text-sm font-medium">Edit Profile</span>
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleSaveProfile}
                className="flex items-center gap-2 bg-rose-500 text-white px-3 py-1 rounded-lg hover:bg-rose-600 transition-colors text-sm"
              >
                <Save className="h-3 w-3" />
                Save
              </button>
              <button
                onClick={handleCancelEditProfile}
                className="flex items-center gap-2 bg-gray-500 text-white px-3 py-1 rounded-lg hover:bg-gray-600 transition-colors text-sm"
              >
                <X className="h-3 w-3" />
                Cancel
              </button>
            </div>
          )}
        </div>

        {!isEditingProfile ? (
          <div className="space-y-3">
            <div>
              <p className="font-medium text-gray-800">{user.name}</p>
              <p className="text-gray-600 text-sm">{user.email}</p>
              <p className="text-gray-600 text-sm">{user.phoneNumber}</p>
              <p className="text-gray-600 text-sm">{user.address}</p>
            </div>
            <button className="text-rose-600 hover:text-rose-700 text-sm font-medium">
              Contact Owner
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={profileForm.name}
                onChange={(e) => handleProfileChange("name", e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-300 focus:border-rose-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={profileForm.email}
                onChange={(e) => handleProfileChange("email", e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-300 focus:border-rose-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone
              </label>
              <input
                type="tel"
                value={profileForm.phone}
                onChange={(e) => handleProfileChange("phone", e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-300 focus:border-rose-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address
              </label>
              <textarea
                value={profileForm.address}
                onChange={(e) => handleProfileChange("address", e.target.value)}
                rows={3}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-300 focus:border-rose-500"
              />
            </div>
          </div>
        )}
      </div>

      {/* Donation Preferences */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-semibold text-gray-800">
            Donation Preferences
          </h3>
          {!isEditingPreferences ? (
            <button
              onClick={handleEditPreferences}
              className="flex items-center gap-2 text-rose-600 hover:text-rose-700 transition-colors"
            >
              <Edit3 className="h-4 w-4" />
              <span className="text-sm font-medium">Update Preferences</span>
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleSavePreferences}
                className="flex items-center gap-2 bg-rose-500 text-white px-3 py-1 rounded-lg hover:bg-rose-600 transition-colors text-sm"
              >
                <Save className="h-3 w-3" />
                Save
              </button>
              <button
                onClick={handleCancelEditPreferences}
                className="flex items-center gap-2 bg-gray-500 text-white px-3 py-1 rounded-lg hover:bg-gray-600 transition-colors text-sm"
              >
                <X className="h-3 w-3" />
                Cancel
              </button>
            </div>
          )}
        </div>

        {!isEditingPreferences ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Causes
              </label>
              <div className="flex flex-wrap gap-2">
                {userData.preferredCauses.map((cause, index) => (
                  <span
                    key={cause}
                    className="bg-rose-100 text-rose-700 px-3 py-1 rounded-full text-sm font-medium"
                  >
                    {cause}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Donation Range
              </label>
              <p className="text-gray-800 font-medium">
                {userData.donationRange} per donation
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Donation Types
              </label>
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
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Causes
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {preferencesForm.preferredCauses.map((cause) => (
                  <span
                    key={cause}
                    className="flex items-center gap-1 bg-rose-100 text-rose-700 px-3 py-1 rounded-full text-sm font-medium"
                  >
                    {cause}
                    <button
                      onClick={() => handleRemoveCause(cause)}
                      className="text-rose-700 hover:text-rose-800"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="relative">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newCause}
                    onChange={(e) => setNewCause(e.target.value)}
                    onFocus={() => setShowCauseDropdown(true)}
                    placeholder="Add a cause..."
                    className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-300 focus:border-rose-500"
                  />
                  <button
                    onClick={() => setShowCauseDropdown(!showCauseDropdown)}
                    className="bg-rose-500 text-white p-2 rounded-lg hover:bg-rose-600 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>

                {showCauseDropdown && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                    {availableCauses
                      .filter(
                        (cause) =>
                          !preferencesForm.preferredCauses.includes(cause)
                      )
                      .map((cause) => (
                        <button
                          key={cause}
                          onClick={() => handleAddCause(cause)}
                          className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors"
                        >
                          {cause}
                        </button>
                      ))}
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Donation Range
              </label>
              <select
                value={preferencesForm.donationRange}
                onChange={(e) =>
                  setPreferencesForm((prev) => ({
                    ...prev,
                    donationRange: e.target.value,
                  }))
                }
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-300 focus:border-rose-500"
              >
                {donationRanges.map((range) => (
                  <option key={range} value={range}>
                    {range}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Donation Types
              </label>
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2 mb-3">
                  {preferencesForm.donationTypes.map((type) => (
                    <span
                      key={type}
                      className="flex items-center gap-1 bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium"
                    >
                      <DonationIcon type={type} />
                      {type}
                      <button
                        onClick={() => handleRemoveDonationType(type)}
                        className="text-gray-700 hover:text-gray-800"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2">
                  {availableDonationTypes
                    .filter(
                      (type) => !preferencesForm.donationTypes.includes(type)
                    )
                    .map((type) => (
                      <button
                        key={type}
                        onClick={() => handleAddDonationType(type)}
                        className="flex items-center gap-1 bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm hover:bg-gray-300 transition-colors"
                      >
                        <Plus className="h-3 w-3" />
                        <DonationIcon type={type} />
                        {type}
                      </button>
                    ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br  from-yellow-100 via-teal-500 via-rose-300 to-rose-500">
      {/* Receipt Modal */}
      {selectedReceipt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Donation Receipt</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => printReceipt(selectedReceipt)}
                    className="flex items-center gap-1 text-blue-600 hover:text-blue-700"
                  >
                    <Receipt className="h-4 w-4" />
                    Print
                  </button>
                  <button
                    onClick={() => downloadReceipt(selectedReceipt)}
                    className="flex items-center gap-1 text-green-600 hover:text-green-700"
                  >
                    <Download className="h-4 w-4" />
                    Download
                  </button>
                  <button
                    onClick={closeReceipt}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>
              </div>
              <div
                className="receipt-content border rounded-lg p-4"
                dangerouslySetInnerHTML={{
                  __html: generateReceiptContent(selectedReceipt),
                }}
              />
            </div>
          </div>
        </div>
      )}

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
                    <h3 className="text-lg font-semibold text-gray-800">
                      Total Donated
                    </h3>
                  </div>
                  <p className="text-3xl font-bold text-rose-600">
                    ${userData.totalDonated}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Award className="h-4 w-4 text-teal-500" />
                      <h4 className="text-sm font-medium text-gray-700">
                        Campaigns
                      </h4>
                    </div>
                    <p className="text-xl font-bold text-gray-800">
                      {userData.campaignsSupported}
                    </p>
                  </div>

                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      <h4 className="text-sm font-medium text-gray-700">
                        Impact Score
                      </h4>
                    </div>
                    <p className="text-xl font-bold text-gray-800">
                      {userData.impactScore}%
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4">
              <nav className="space-y-2">
                {[
                  {
                    id: "personalized",
                    label: "Personalized Feed",
                    icon: Heart,
                  },
                  { id: "history", label: "Donation History", icon: Clock },
                  {
                    id: "profile",
                    label: "Profile & Preferences",
                    icon: Users,
                  },
                ].map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveTab(tab.id);
                        // Reset emergency filter when switching tabs
                        if (tab.id !== "personalized") {
                          setShowEmergencyOnly(false);
                        }
                      }}
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
