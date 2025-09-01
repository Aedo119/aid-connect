function SocialIcon({ d, label }) {
  return (
    <a
      href="#"
      aria-label={label}
      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/20 
                 hover:border-transparent hover:bg-gradient-to-r hover:from-teal-400 hover:to-cyan-500 
                 hover:text-white transition"
    >
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
        <path d={d} />
      </svg>
    </a>
  );
}

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-[#0b1220] to-[#111a2e] text-gray-300">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-y-10 gap-x-10 md:grid-cols-4 items-start">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 text-white">
              
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-7 h-7 text-rose-500"
          >
            <path d="M20.8 4.6c-1.8-1.9-4.8-1.9-6.6 0L12 6.8l-2.2-2.2c-1.8-1.9-4.8-1.9-6.6 0s-1.8 5 0 6.9l8.8 9 8.8-9c1.8-1.9 1.8-5 0-6.9z" />
          </svg>
              <span className="text-xl font-extrabold">AidConnect+</span>
            </div>
            <p className="mt-3 text-sm opacity-80">
              Connecting generous hearts with meaningful causes. Together, we create lasting change.
            </p>
            <div className="mt-4 flex items-center gap-3 text-white/80">
              <SocialIcon
                label="Facebook"
                d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"
              />
              <SocialIcon
                label="Twitter"
                d="M23 3a10.9 10.9 0 01-3.14 1.53A4.48 4.48 0 0016 3a4.5 4.5 0 00-4.4 5.52A12.94 12.94 0 013 4s-4 9 5 13a13.38 13.38 0 01-8 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"
              />
              <SocialIcon
                label="Instagram"
                d="M7 2h10a5 5 0 015 5v10a5 5 0 01-5 5H7a5 5 0 01-5-5V7a5 5 0 015-5zm5 4a6 6 0 100 12 6 6 0 000-12zm6.5-1.5a1.5 1.5 0 11-3.001.001A1.5 1.5 0 0118.5 4.5z"
              />
            </div>
          </div>

          {/* Links */}
          {[
            { title: "Quick Links", items: ["Home", "Browse Campaigns", "About Us", "Contact"] },
            { title: "For Organizations", items: ["Start a Campaign", "Resources", "Guidelines", "Support"] },
          ].map((section) => (
            <div key={section.title}>
              <h4 className="mb-4 font-semibold text-white flex items-center gap-2">
                <span className="h-5 w-1.5 rounded-full bg-gradient-to-b from-teal-400 to-cyan-500"></span>
                {section.title}
              </h4>
              <ul className="space-y-2 text-sm">
                {section.items.map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="hover:text-white hover:underline transition"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact */}
          <div>
            <h4 className="mb-4 font-semibold text-white flex items-center gap-2">
              <span className="h-5 w-1.5 rounded-full bg-gradient-to-b from-teal-400 to-cyan-500"></span>
              Contact Us
            </h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <span className="text-white/70"></span> help@donatehub.org
              </li>
              <li className="flex items-center gap-2">
                <span className="text-white/70"></span> +1 (555) 123-4567
              </li>
              <li className="flex items-center gap-2">
                <span className="text-white/70"></span> 123 Charity Street, Hope City
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-10 border-t border-white/10 pt-2.5 text-center text-xs text-white/60">
          © {new Date().getFullYear()} DonateHub. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
