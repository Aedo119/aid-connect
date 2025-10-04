import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Announcement from "./components/announcement.jsx";
import FeaturedCampaigns from "./components/FeaturedCampaigns";
import ImpactStats from "./components/ImpactStats";
import Testimonials from "./components/Testimonials";
import Footer from "./components/Footer";
import DonorLogin from "./pages/DonorLogin";
import DonationPage from "./pages/DonationPage.jsx";
import NGOLogin from "./pages/NGOLogin.jsx";
import DonorSignUp from "./pages/DonorSignUp.jsx";
import NGOSignUp from "./pages/NGOSignUp.jsx";
import DonationConfirmation from "./pages/DonationConfirmation.jsx";
import NGODashboard from "./pages/NGODashboard.jsx";
import EditCampaign from "./pages/EditCampaign.jsx";
import NewCampaign from "./pages/NewCampaign.jsx";
import DonorDashboard from "./pages/DonorDashboard.jsx";
function HomePage() {


  // useEffect(async()=>{
  //   const response=await authAPI.refresh();
    
  // })
  return (
    <>
      <section id="hero">
        <Hero />
      </section>

      <section id="announcement">
        <Announcement />
      </section>

      <section id="featured-campaigns">
        <FeaturedCampaigns />
      </section>

      <section id="impact-stats">
        <ImpactStats />
      </section>

      <section id="testimonials">
        <Testimonials />
      </section>

      <section id="footer">
        <Footer />
      </section>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="text-gray-800">
          <Navbar />

          <Routes>
            {/* Homepage */}
            <Route path="/" element={<HomePage />} />

            {/* Donation Page */}
            <Route path="/donate/:id" element={<DonationPage />} />

            {/* Donor Sign Up Page */}
            <Route path="/donor-signup" element={<DonorSignUp />} />

            {/* Donor Login Page */}
            <Route path="/donor-login" element={<DonorLogin />} />

            {/* NGO Sign Up Page */}
            <Route path="/ngo-signup" element={<NGOSignUp />} />

            {/* NGO Login Page */}
            <Route path="/ngo-login" element={<NGOLogin />} />

            {/* Donation Confirmation Page */}
            <Route
              path="/donation-confirmation/:id/:type"
              element={<DonationConfirmation />}
            />

            {/* NGO Dashboard */}
            <Route path="/ngo-dashboard" element={<NGODashboard />} />

            {/* Donor Dashboard */}
            <Route path="/donor-dashboard" element={<DonorDashboard />} />

            {/* Edit Campaign Page */}
            <Route path="/edit-campaign/:id" element={<EditCampaign />} />

            {/* New Campaign Page*/}
            <Route path="/new-campaign" element={<NewCampaign />} />

            {/* Redirect unknown routes to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}
