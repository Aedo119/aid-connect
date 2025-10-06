import { useState } from "react";
import ProgressBar from "./ProgressBar";
import {
  DollarSign,
  Package,
  Shirt,
  Cross,
  Heart,
  ArrowLeft,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import api from "../API/api";

function StatIcon({ type }) {
  if (type === "donors") {
    return (
      <svg
        className="h-4 w-4"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
      >
        <path strokeWidth="2" d="M16 14a4 4 0 10-8 0" />
        <circle cx="12" cy="7" r="3" strokeWidth="2" />
      </svg>
    );
  }
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
    >
      <path strokeWidth="2" d="M12 8v4l3 3" />
      <circle cx="12" cy="12" r="9" strokeWidth="2" />
    </svg>
  );
}

// Map donation types to icons
function DonationIcon({ type }) {
  // Add safety check for type
  if (!type) return <Heart className="h-4 w-4 text-rose-600" />;

  const iconMap = {
    money: <DollarSign className="h-4 w-4 text-green-600" />,
    food: <Package className="h-4 w-4 text-yellow-600" />,
    clothes: <Shirt className="h-4 w-4 text-blue-600" />,
    "medical supplies": <Cross className="h-4 w-4 text-red-600" />,
  };

  return (
    iconMap[type.toLowerCase()] || <Heart className="h-4 w-4 text-rose-600" />
  );
}

export default function AllCampaigns() {
  const [selectedDonationTypes, setSelectedDonationTypes] = useState({});
  const [campaigns, setCampaigns] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const handleDonationTypeClick = (campaignId, donationType) => {
    if (!donationType) return;

    setSelectedDonationTypes((prev) => ({
      ...prev,
      [campaignId]: donationType.toLowerCase(),
    }));
  };

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        setLoading(true);
        const response = await api.get("/campaign/all");
        console.log("Fetched campaigns:", response.data.campaigns);
        setCampaigns(response.data.campaigns || []);
      } catch (err) {
        console.error("Error fetching campaigns:", err);
        setError("Failed to load campaigns.");
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-8">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">All Campaigns</h1>
          </div>
          <div className="flex justify-center items-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading campaigns...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-8">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">All Campaigns</h1>
          </div>
          <div className="flex justify-center items-center py-12">
            <div className="text-center">
              <p className="text-red-600 text-lg">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-7xl px-4">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">All Campaigns</h1>
          <p className="mt-2 text-gray-600">
            Browse all available campaigns and support the causes that matter to
            you
          </p>
        </div>

        {/* Campaigns Grid */}
        {campaigns.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No campaigns found.</p>
            <p className="text-gray-400 mt-2">
              Check back later for new campaigns.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {campaigns.map((c) => {
              if (!c) return null; // Skip undefined campaigns

              // Safe calculation of progress percentage
              const raised = Number(c.raised_amount) || 0;
              const goal = Number(c.goal_amount) || 1; // Avoid division by zero
              const pct = Math.min((raised / goal) * 100, 100); // Cap at 100%

              // Safe access to donationTypes with fallback
              const donationTypes = Array.isArray(c.donationTypes)
                ? c.donationTypes
                : ["money"];
              const selectedType =
                selectedDonationTypes[c.campaign_id] ||
                (donationTypes[0] ? donationTypes[0].toLowerCase() : "money");

              // Safe date calculation
              const daysLeft =
                c.end_date && c.start_date
                  ? Math.max(
                      0,
                      Math.floor(
                        (new Date(c.end_date) - new Date(c.start_date)) /
                          (1000 * 60 * 60 * 24)
                      )
                    )
                  : 0;

              return (
                <article
                  key={c.campaign_id || Math.random()} // Fallback key
                  className={`flex flex-col overflow-hidden rounded-lg shadow-md transition-all hover:shadow-lg bg-white ${
                    c.labelLeft === "Emergency"
                      ? "border-l-4 border-l-red-500"
                      : "border-l border-l-gray-200"
                  }`}
                >
                  {/* Image with badges */}
                  <div className="relative">
                    <img
                      src={
                        c.image ||
                        "https://via.placeholder.com/300x176?text=No+Image"
                      }
                      alt={c.title || "Campaign"}
                      className="h-44 w-full object-cover"
                    />
                    {c.tag && (
                      <span className="absolute left-3 top-3 rounded-full bg-red-600 px-2 py-1 text-xs font-medium text-white shadow">
                        {c.tag}
                      </span>
                    )}
                  </div>

                  {/* Body */}
                  <Link
                    to={`/donate/${c.campaign_id}`}
                    state={{ campaign: c }}
                    className="flex-grow space-y-3 p-5 cursor-pointer block"
                  >
                    <h3 className="text-lg font-semibold leading-snug hover:text-teal-600 transition-colors">
                      {c.title || "Untitled Campaign"}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {c.description || "No description available."}
                    </p>
                    <p className="text-xs text-gray-500">
                      by{" "}
                      <span className="font-medium text-gray-700">
                        {c.organization_name || "Unknown Organization"}
                      </span>
                    </p>
                  </Link>

                  {/* Footer */}
                  <div className="p-5 pt-0 space-y-3 mt-auto">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-semibold">
                          ${raised.toLocaleString()} raised
                        </span>
                        <span className="text-gray-600">
                          Goal: ${goal.toLocaleString()}
                        </span>
                      </div>
                      <div className="mb-3">
                        <div className="flex justify-between text-sm text-gray-600 mb-1">
                          <span>Progress</span>
                          <span>
                            {(c.raised_amount / c.goal_amount) * 100}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="h-2 rounded-full bg-rose-500"
                            style={{
                              width: `${
                                (c.raised_amount / c.goal_amount) * 100
                              }%`,
                            }}
                          ></div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-600">
                        <div className="flex items-center gap-1">
                          <StatIcon type="donors" />
                          <span>{c.donors || 0} donors</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <StatIcon type="time" />
                          <span>{daysLeft} days left</span>
                        </div>
                      </div>
                    </div>

                    {/* Donation type chips with icons - only render if we have donation types */}
                    {donationTypes.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {donationTypes.map((t) => {
                          if (!t) return null; // Skip undefined types

                          const typeKey = t.toLowerCase();
                          const isSelected = selectedType === typeKey;

                          return (
                            <button
                              key={t}
                              onClick={(e) => {
                                e.stopPropagation(); // Prevent navigation
                                handleDonationTypeClick(c.campaign_id, t);
                              }}
                              className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors ${
                                isSelected
                                  ? "bg-rose-100 text-rose-700 border border-rose-300"
                                  : "bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200"
                              }`}
                            >
                              <DonationIcon type={t} />
                              <span>{t}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}

                    <Link
                      to={`/donation-confirmation/${c.campaign_id}/${selectedType}`}
                      className={`block text-center w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                        c.labelLeft === "Emergency"
                          ? "bg-red-600 text-white hover:bg-red-700"
                          : "bg-teal-500 text-white hover:bg-teal-600"
                      }`}
                    >
                      Donate Now
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
