import { useState, useEffect } from "react";
import ProgressBar from "./ProgressBar";
import { DollarSign, Package, Shirt, Cross, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
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

export default function FeaturedCampaigns() {
  const [campaigns, setCampaigns] = useState([]);
  const [selectedDonationTypes, setSelectedDonationTypes] = useState({});
  const { user } = useAuth();
  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const result = await api.get("/campaign/all");
        setCampaigns(result.data.campaigns);
      } catch (err) {
        console.error("Failed to fetch campaigns:", err);
      }
    };
    fetchCampaigns();
  }, [user]);

  // Show only first 3 campaigns as featured
  const featuredCampaigns = campaigns.slice(0, 3);

  const handleDonationTypeClick = (campaignId, donationType) => {
    setSelectedDonationTypes((prev) => ({
      ...prev,
      [campaignId]: donationType.toLowerCase(),
    }));
  };

  return (
    <section className="py-12 md:py-14">
      <div className="mx-auto max-w-7xl px-4">
        <h2 className="text-center text-3xl font-extrabold md:text-[32px]">
          Featured Campaigns
        </h2>
        <p className="mx-auto mt-2 max-w-2xl text-center text-gray-600">
          Support these high‑impact campaigns and see your donations make a real
          difference
        </p>

        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featuredCampaigns.map((c) => {
            const pct = (c.raised_amount / c.goal_amount) * 100;
            const selectedType =
              selectedDonationTypes[c.campaign_id] ||
              c.donationTypes[0].toLowerCase();

            return (
              <article
                key={c.campaign_id}
                className={`flex flex-col overflow-hidden rounded-lg shadow-md transition-all hover:shadow-lg ${
                  c.labelLeft === "Emergency"
                    ? "border-l-4 border-l-red-500"
                    : "border-l border-l-gray-200"
                }`}
              >
                {/* Image with badges */}
                <div className="relative">
                  <img
                    src={c.image}
                    alt={c.title}
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
                  className="flex-grow space-y-3 p-5 cursor-pointer"
                >
                  <h3 className="text-lg font-semibold leading-snug hover:text-teal-600 transition-colors">
                    {c.title}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {c.description}
                  </p>
                  <p className="text-xs text-gray-500">
                    by{" "}
                    <span className="font-medium text-gray-700">
                      {c.organization_name}
                    </span>
                  </p>
                </Link>

                {/* Footer */}
                <div className="p-5 pt-0 space-y-3 mt-auto">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-semibold">
                        ${c.raised_amount} raised
                      </span>
                      <span className="text-gray-600">
                        Goal: ${c.goal_amount}
                      </span>
                    </div>
                    <ProgressBar value={pct} />
                    <div className="flex items-center justify-between text-xs text-gray-600">
                      <div className="flex items-center gap-1">
                        <StatIcon type="donors" />
                        <span>{c.donors} donors</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <StatIcon type="time" />
                        <span>
                          {Math.floor(
                            (new Date(c.end_date) - new Date(c.start_date)) /
                              (1000 * 60 * 60 * 24)
                          )}{" "}
                          days left
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Donation type chips with icons */}
                  <div className="flex flex-wrap gap-2">
                    {c.donationTypes.map((t) => {
                      const typeKey = t.toLowerCase();
                      const isSelected = selectedType === typeKey;

                      return (
                        <button
                          key={t}
                          onClick={() =>
                            handleDonationTypeClick(c.campaign_id, t)
                          }
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

        <div className="mt-8 flex justify-center">
          <Link
            to="/campaigns"
            className="px-5 py-2 border border-gray-300 bg-white rounded-lg hover:bg-gray-100 transition-colors"
          >
            View All Campaigns
          </Link>
        </div>
      </div>
    </section>
  );
}
