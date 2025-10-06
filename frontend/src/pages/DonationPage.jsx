import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { campaigns } from "../data/campaigns";
import { useLocation } from "react-router-dom";

export default function DonationPage() {
  const location = useLocation();
  const { id } = useParams();
  const navigate = useNavigate();
  console.log(location.state);
  const { campaign } = location.state || {};
  console.log(campaign);
  const [selectedTab, setSelectedTab] = useState("story");
  const [donationType, setDonationType] = useState(
    campaign?.donationTypes?.[0].toLowerCase() || "money"
  );

  if (!campaign) {
    return <p className="text-center mt-10 text-red-500">Campaign not found</p>;
  }

  const raisedPercent = Math.min(
    (campaign.raised_amount / campaign.goal_amount) * 100,
    100
  );

  const handleDonateClick = () => {
    // Navigate to the donation confirmation page with the selected type
    navigate(`/donation-confirmation/${campaign.campaign_id}/${donationType}`);
  };

  return (
    <div className="max-w-7xl mx-auto py-12 px-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left/Main Content */}
      <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
        <img
          src={campaign.image}
          alt={campaign.title}
          className="w-full h-60 object-cover rounded-lg mb-6"
        />

        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">{campaign.title}</h1>
          {campaign.tag && (
            <span className="text-xs bg-yellow-400 text-white px-3 py-1 rounded-full font-semibold">
              {campaign.tag}
            </span>
          )}
        </div>

        <div className="flex items-center text-gray-600 text-sm mb-6 space-x-4">
          <div className="flex items-center">
            <svg
              className="w-4 h-4 mr-1"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 7V3m8 4V3m-9 8h10m-5 5v5"
              ></path>
            </svg>
            <span>
              {Math.floor(
                (new Date(campaign.end_date) - new Date(campaign.start_date)) /
                  (1000 * 60 * 60 * 24)
              )}{" "}
              days left
            </span>
          </div>
        </div>

        <p className="text-gray-700 mb-4">{campaign.description}</p>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            {["story", "updates", "donors"].map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedTab(tab)}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                  selectedTab === tab
                    ? "border-red-500 text-red-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>

        <div className="text-gray-700 text-sm space-y-3">
          {selectedTab === "story" && <p>{campaign.description}</p>}
          {selectedTab === "updates" && <p>No updates yet.</p>}
          {selectedTab === "donors" && (
            <div></div>
            // <div>
            //   <h3 className="font-semibold text-lg mb-4">Recent Donors</h3>
            //   <ul className="space-y-4">
            //     {[
            //       {
            //         name: "Sarah M.",
            //         date: "1/20/2025",
            //         amount: 150,
            //         type: "Money",
            //       },
            //       {
            //         name: "Anonymous",
            //         date: "1/19/2025",
            //         amount: 75,
            //         type: "Money",
            //       },
            //       {
            //         name: "Michael C.",
            //         date: "1/18/2025",
            //         amount: 200,
            //         type: "Money",
            //       },
            //       {
            //         name: "Emily R.",
            //         date: "1/17/2025",
            //         amount: 100,
            //         type: "Money",
            //       },
            //       {
            //         name: "David L.",
            //         date: "1/16/2025",
            //         amount: 50,
            //         type: "Money",
            //       },
            //     ].map((donor, index) => (
            //       <li
            //         key={index}
            //         className="flex justify-between items-center border-b border-gray-200 pb-2"
            //       >
            //         <div className="flex items-center gap-3">
            //           <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center font-bold text-gray-700">
            //             {donor.name.charAt(0)}
            //           </div>
            //           <div>
            //             <p className="font-medium">{donor.name}</p>
            //             <p className="text-xs text-gray-500">{donor.date}</p>
            //           </div>
            //         </div>
            //         <div className="flex items-center gap-2">
            //           <span className="font-bold">${donor.amount}</span>
            //           <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded">
            //             {donor.type}
            //           </span>
            //         </div>
            //       </li>
            //     ))}
            //   </ul>
            // </div>
          )}
        </div>
      </div>

      {/* Right Sidebar */}
      <aside className="space-y-6">
        {/* Donation progress */}
        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <p className="text-sm font-semibold mb-2">
            ${campaign.raised_amount} raised
          </p>
          <div className="w-full bg-gray-200 rounded-full h-3 mb-2 overflow-hidden">
            <div
              className="bg-red-500 h-3"
              style={{ width: `${raisedPercent}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 mb-4">
            Goal: ${campaign.goal_amount} <br />
            <span className="font-bold">
              ${Math.max(campaign.goal_amount - campaign.raised_amount, 0)} to
              go
            </span>
          </p>
          <div className="flex justify-between mb-4">
            <div>
              <p className="font-bold text-lg">{campaign.donors}</p>
              <p className="text-xs text-gray-500">Donors</p>
            </div>
            <div>
              {Math.floor(
                (new Date(campaign.end_date) - new Date(campaign.start_date)) /
                  (1000 * 60 * 60 * 24)
              )}{" "}
              Days Left
            </div>
          </div>

          <div className="mb-4">
            <p className="text-sm font-semibold mb-1">Choose donation type:</p>
            <div className="flex gap-2">
              {campaign.donationTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setDonationType(type.toLowerCase())}
                  className={`flex-1 py-2 rounded border ${
                    donationType === type.toLowerCase()
                      ? "bg-green-50 border-green-500 text-green-700"
                      : "border-gray-300 text-gray-700"
                  } font-semibold transition-colors`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleDonateClick}
            className="w-full bg-red-600 text-white py-3 rounded font-semibold hover:bg-red-700 transition relative"
          >
            Donate Now
          </button>
        </div>

        {/* Organization Card */}
        <div className="bg-white rounded-lg shadow p-4 border border-gray-200 flex items-center space-x-4">
          <div className="w-14 h-14 rounded-md bg-gray-200 flex items-center justify-center text-gray-400 font-bold text-xl">
            {campaign.org}
          </div>
          <div>
            <h3 className="font-semibold">{campaign.org}</h3>
            <p className="text-xs text-gray-600">
              Providing emergency relief and long-term development support to
              communities in crisis.
            </p>
            <button className="mt-2 px-3 py-1 border border-gray-300 rounded text-xs hover:bg-gray-100">
              View Organization
            </button>
          </div>
        </div>

        {/* Campaign Details */}
        <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
          <h4 className="font-semibold mb-4">Campaign Details</h4>
          <div className="text-sm space-y-2 text-gray-700">
            <div className="flex justify-between">
              <span>Category</span>
              <span>{campaign.category || "N/A"}</span>
            </div>
            <div className="flex justify-between">
              <span>Days Left</span>
              {Math.floor(
                (new Date(campaign.end_date) - new Date(campaign.start_date)) /
                  (1000 * 60 * 60 * 24)
              )}{" "}
            </div>
            <div className="flex justify-between">
              <span>Donors</span>
              <span>{campaign.donors}</span>
            </div>
            <div className="flex justify-between">
              <span>Goal</span>
              <span>${campaign.goal_amount}</span>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
