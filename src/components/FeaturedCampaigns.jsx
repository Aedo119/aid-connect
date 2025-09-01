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
  return iconMap[type.toLowerCase()] || <Heart className="h-4 w-4 text-pink-600" />;
}

export default function FeaturedCampaigns() {
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
            return (
              <article
                key={c.id}
                className={`card flex flex-col overflow-hidden ${
                  c.labelLeft === "Emergency" ? "card-emergency" : "card-normal"
                }`}
              >
                {/* Image with badges */}
                <div className="relative">
                  <img src={c.image} alt={c.title} className="h-44 w-full object-cover" />
                  {c.labelLeft && (
                    <span className="chip absolute left-3 top-3 bg-red-600 text-white shadow">
                      {c.labelLeft}
                    </span>
                  )}
                  {c.labelRight && (
                    <span className="chip absolute right-3 top-3 bg-rose-50 text-rose-500">
                      {c.labelRight}
                    </span>
                  )}
                </div>

                {/* Body */}
                <div className="flex-grow space-y-3 p-5">
                  <h3 className="text-lg font-semibold leading-snug">{c.title}</h3>
                  <p className="text-sm text-gray-600">{c.desc}</p>
                  <p className="text-xs text-gray-500">
                    by <span className="font-medium text-gray-700">{c.org}</span>
                  </p>
                </div>

                {/* Footer */}
                <div className="p-5 pt-0 space-y-3 border-t mt-auto">
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
                    {c.donationTypes.map((t) => (
                      <span
                        key={t}
                        className="chip flex items-center gap-1 bg-gray-100 text-gray-700 px-2 py-1 rounded"
                      >
                        <DonationIcon type={t} />
                        <span>{t}</span>
                      </span>
                    ))}
                  </div>

<Link
  to={`/donate/${c.id}`}
  className={`block text-center w-full ${
    c.labelLeft === "Emergency" ? "btn-emergency" : "btn-normal"
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
          <button className="btn px-5 py-2 border border-gray-300 bg-white hover:bg-gray-100">
            View All Campaigns
          </button>
        </div>
      </div>
    </section>
  );
}
