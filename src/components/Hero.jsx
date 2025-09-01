export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Teal 400 → Teal 500 → Rose 100 → Rose 300 gradient */}
      <div className="bg-gradient-to-br from-yellow-100 via-teal-500 via-rose-300 to-rose-500">
        <div className="mx-auto max-w-7xl px-4 py-20 text-center text-white md:py-24">
          <h1 className="mx-auto max-w-4xl text-4xl font-extrabold leading-tight md:text-6xl">
            Make a Difference Today
          </h1>
          <p className="mx-auto mt-4 max-w-3xl text-lg md:text-xl opacity-95">
            Connect with causes that matter. Every donation creates lasting change in communities worldwide.
          </p>

          {/* Search bar */}
          <div className="mx-auto mt-8 flex max-w-3xl items-center justify-center gap-3">
            <input
              type="text"
              placeholder="Search campaigns, causes, or locations..."
              className="w-full rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-opacity-50 shadow-md transition duration-300 hover:shadow-lg"
            />
            <button className="bg-white text-rose-500 hover:bg-teal-50 px-6 py-3 font-semibold shadow-md rounded-lg transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0">
              Search
            </button>
          </div>

          {/* CTA buttons */}
          <div className="mt-8 flex justify-center gap-4">
            <button className="bg-white text-rose-500 hover:bg-rose-50 px-6 py-3 font-semibold shadow-md rounded-lg transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0">
              Start Donating
            </button>
            <button className="bg-white text-rose-500 hover:bg-rose-50 px-6 py-3 font-semibold shadow-md rounded-lg transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0">
              Start a Campaign
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}