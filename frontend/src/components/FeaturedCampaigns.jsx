import { useState } from "react";
import { campaigns } from "../data/campaigns";
import ProgressBar from "./ProgressBar";
import { DollarSign, Package, Shirt, Cross, Heart } from "lucide-react";
import { Link } from "react-router-dom";

function StatIcon({ type }) {
  if (type === "donors") {
    return (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path strokeWidth="2" d="M16 14a4 4 0 10-8 0" />
        <circle cx="12" cy="7" r="3" strokeWidth="2" />
      </svg>
    );
  }
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
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
  return iconMap[type.toLowerCase()] || <Heart className="h-4 w-4 text-rose-600" />;
}

export default function FeaturedCampaigns() {
  const [selectedDonationTypes, setSelectedDonationTypes] = useState({});

  const handleDonationTypeClick = (campaignId, donationType) => {
    setSelectedDonationTypes(prev => ({
      ...prev,
      [campaignId]: donationType.toLowerCase()
    }));
  };

  return (
    <section className="py-12 md:py-14">
      <div className="mx-auto max-w-7xl px-4">
        <h2 className="text-center text-3xl font-extrabold md:text-[32px]">
          Featured Campaigns
        </h2>
        <p className="mx-auto mt-2 max-w-2xl text-center text-gray-600">
          Support these high‑impact campaigns and see your donations make a real difference
        </p>

        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {campaigns.map((c) => {
            const pct = (c.raised / c.goal) * 100;
            const selectedType = selectedDonationTypes[c.id] || c.donationTypes[0].toLowerCase();
            
            return (
              <article
                key={c.id}
                className={`flex flex-col overflow-hidden rounded-lg shadow-md transition-all hover:shadow-lg ${
                  c.labelLeft === "Emergency" 
                    ? "border-l-4 border-l-red-500" 
                    : "border-l border-l-gray-200"
                }`}
              >
                {/* Image with badges */}
                <div className="relative">
                  <img src={c.image} alt={c.title} className="h-44 w-full object-cover" />
                  {c.labelLeft && (
                    <span className="absolute left-3 top-3 rounded-full bg-red-600 px-2 py-1 text-xs font-medium text-white shadow">
                      {c.labelLeft}
                    </span>
                  )}
                  {c.labelRight && (
                    <span className="absolute right-3 top-3 rounded-full bg-rose-50 px-2 py-1 text-xs font-medium text-rose-500">
                      {c.labelRight}
                    </span>
                  )}
                </div>

                {/* Body */}
                <Link to={`/donate/${c.id}`} className="flex-grow space-y-3 p-5 cursor-pointer">
                  <h3 className="text-lg font-semibold leading-snug hover:text-teal-600 transition-colors">
                    {c.title}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-2">{c.desc}</p>
                  <p className="text-xs text-gray-500">
                    by <span className="font-medium text-gray-700">{c.org}</span>
                  </p>
                </Link>

                {/* Footer */}
                <div className="p-5 pt-0 space-y-3 mt-auto">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-semibold">${c.raised.toLocaleString()} raised</span>
                      <span className="text-gray-600">Goal: ${c.goal.toLocaleString()}</span>
                    </div>
                    <ProgressBar value={pct} />
                    <div className="flex items-center justify-between text-xs text-gray-600">
                      <div className="flex items-center gap-1">
                        <StatIcon type="donors" />
                        <span>{c.donors} donors</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <StatIcon type="time" />
                        <span>{c.daysLeft} days left</span>
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
                          onClick={() => handleDonationTypeClick(c.id, t)}
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
                    to={`/donation-confirmation/${c.id}/${selectedType}`}
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
            to="/donate"
            className="px-5 py-2 border border-gray-300 bg-white rounded-lg hover:bg-gray-100 transition-colors"
          >
            View All Campaigns
          </Link>
        </div>
      </div>
    </section>
  );
}