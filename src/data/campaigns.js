import emergencyFoodImg from "../assets/image/earthquake-1080x599.jpg";

export const campaigns = [
{
  id: 1,
  labelLeft: "Emergency",
  labelRight: "Emergency Relief",
  title: "Emergency Food Relief for Earthquake Victims",
  desc: "Providing immediate food assistance to families affected by the recent earthquake in rural communities.",
  org: "Global Relief Foundation",
  raised: 32000,
  goal: 50000,
  donors: 245,
  daysLeft: 12,
  donationTypes: ["money", "food"],
  image: emergencyFoodImg,
  createdDate: "2025-08-01",
  endDate: "2025-08-25",
  category: "Emergency Relief",
  location: "Rural Communities, Country X"
}

,
  {
    id: 2,
    labelLeft: "",
    labelRight: "Water & Sanitation",
    title: "Clean Water Initiative for Remote Villages",
    desc: "Building wells and water filtration systems to provide clean drinking water to underserved communities.",
    org: "Clean Water Alliance",
    raised: 45000,
    goal: 75000,
    donors: 189,
    daysLeft: 25,
    donationTypes: ["money", "medical supplies"],
    image: "https://images.unsplash.com/photo-1508672019048-805c876b67e2?q=80&w=1200&auto=format&fit=crop",
    createdDate: "2025-07-15",
    endDate: "2025-08-30",
    category: "Water & Sanitation",
    location: "Remote Villages, Country Y"
  },
  {
    id: 3,
    labelLeft: "",
    labelRight: "Education",
    title: "Educational Support for Underprivileged Children",
    desc: "Providing school supplies, books, and educational resources to children in need.",
    org: "Education for All",
    raised: 18500,
    goal: 25000,
    donors: 156,
    daysLeft: 18,
    donationTypes: ["money", "clothes"],
    image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1200&auto=format&fit=crop",
    createdDate: "2025-07-20",
    endDate: "2025-08-28",
    category: "Education",
    location: "City Z, Country Z"
  }
];
