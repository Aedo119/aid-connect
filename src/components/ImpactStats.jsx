import { ArrowTrendingUpIcon, UsersIcon, CalendarDaysIcon, MapPinIcon } from "@heroicons/react/24/outline";

function StatCard({ icon: Icon, value, label, color, bgColor }) {
  return (
    <div className="bg-white rounded-xl shadow-md p-8 flex flex-col items-center text-center transition transform hover:-translate-y-1 hover:shadow-lg">
      {/* Icon with subtle background */}
      <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-6 ${bgColor}`}>
        {Icon && <Icon className={`h-7 w-7 ${color}`} />}
      </div>

      <div className="text-4xl font-extrabold text-gray-900">{value}</div>
      <p className="mt-2 text-lg font-medium text-gray-600">{label}</p>
    </div>
  );
}

export default function ImpactStats() {
  return (
    <section className="bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-4xl font-bold text-gray-900 mb-4">
          Our Impact Together
        </h2>
        <p className="text-center text-lg text-gray-600 mb-16">
          See the difference we’re making worldwide
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
          <StatCard
            value="$2.4M+"
            label="Total Donated"
            color="text-green-600"
            bgColor="bg-green-100"
            icon={ArrowTrendingUpIcon}
          />
          <StatCard
            value="12,500+"
            label="Active Donors"
            color="text-blue-600"
            bgColor="bg-blue-100"
            icon={UsersIcon}
          />
          <StatCard
            value="350+"
            label="Campaigns Funded"
            color="text-orange-500"
            bgColor="bg-orange-100"
            icon={CalendarDaysIcon}
          />
          <StatCard
            value="45+"
            label="Countries Reached"
            color="text-purple-600"
            bgColor="bg-purple-100"
            icon={MapPinIcon}
          />
        </div>
      </div>
    </section>
  );
}
