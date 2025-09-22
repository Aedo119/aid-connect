import emergencyFoodImg from "../assets/image/earthquake-1080x599.jpg";

export const campaigns = [
  {
    id: 1,
    labelLeft: "Emergency",
    labelRight: "Emergency Relief",
    title: "Emergency Food Relief for Earthquake Victims",
    desc: "Providing immediate food assistance to families affected by the recent earthquake in rural communities.",
    org: "Global Relief Foundation",
    orgId: 101, // Added organization ID for database reference
    raised: 32000,
    goal: 50000,
    donors: 245,
    daysLeft: 12,
    donationTypes: ["money", "food"],
    image: emergencyFoodImg,
    createdDate: "2025-08-01",
    endDate: "2025-08-25",
    category: "Emergency Relief",
    location: "Rural Communities, Country X",
    status: "active", // Added status field
    progress: 64, // Added progress percentage
    // Additional details for NGO dashboard
    updates: [
      {
        date: "2025-08-15",
        title: "First shipment delivered",
        content: "Distributed food packages to 250 families in the affected region."
      },
      {
        date: "2025-08-10",
        title: "Partnership with local NGOs",
        content: "Established collaboration with 3 local organizations for distribution."
      }
    ],
    expenses: [
      {
        category: "Food Supplies",
        amount: 15000,
        description: "Purchase of non-perishable food items"
      },
      {
        category: "Logistics",
        amount: 5000,
        description: "Transportation and distribution costs"
      }
    ],
    volunteers: 45,
    impact: "Aiding 500+ families across 3 villages"
  },
  {
    id: 2,
    labelLeft: "",
    labelRight: "Water & Sanitation",
    title: "Clean Water Initiative for Remote Villages",
    desc: "Building wells and water filtration systems to provide clean drinking water to underserved communities.",
    org: "Clean Water Alliance",
    orgId: 102, // Added organization ID for database reference
    raised: 45000,
    goal: 75000,
    donors: 189,
    daysLeft: 25,
    donationTypes: ["money", "medical supplies"], // Fixed hyphenation for consistency
    image: "https://images.unsplash.com/photo-1508672019048-805c876b67e2?q=80&w=1200&auto=format&fit=crop",
    createdDate: "2025-07-15",
    endDate: "2025-08-30",
    category: "Water & Sanitation",
    location: "Remote Villages, Country Y",
    status: "active", // Added status field
    progress: 60, // Added progress percentage
    // Additional details for NGO dashboard
    updates: [
      {
        date: "2025-08-12",
        title: "First well completed",
        content: "Successfully built and activated the first water well serving 200 people."
      }
    ],
    expenses: [
      {
        category: "Construction Materials",
        amount: 25000,
        description: "Well construction and filtration system components"
      },
      {
        category: "Labor",
        amount: 8000,
        description: "Local workforce hiring and training"
      }
    ],
    volunteers: 28,
    impact: "Providing clean water to 3 villages with 1000+ residents"
  },
  {
    id: 3,
    labelLeft: "",
    labelRight: "Education",
    title: "Educational Support for Underprivileged Children",
    desc: "Providing school supplies, books, and educational resources to children in need.",
    org: "Education for All",
    orgId: 103, // Added organization ID for database reference
    raised: 18500,
    goal: 25000,
    donors: 156,
    daysLeft: 18,
    donationTypes: ["money", "clothes"],
    image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1200&auto=format&fit=crop",
    createdDate: "2025-07-20",
    endDate: "2025-08-28",
    category: "Education",
    location: "City Z, Country Z",
    status: "active", // Added status field
    progress: 74, // Added progress percentage
    // Additional details for NGO dashboard
    updates: [
      {
        date: "2025-08-14",
        title: "School supplies distributed",
        content: "Provided backpacks and supplies to 350 students at Central School."
      }
    ],
    expenses: [
      {
        category: "Educational Materials",
        amount: 10000,
        description: "Textbooks, notebooks, and learning aids"
      },
      {
        category: "School Supplies",
        amount: 5000,
        description: "Backpacks, pens, pencils, and other essentials"
      }
    ],
    volunteers: 32,
    impact: "Supporting education for 500+ children across 5 schools"
  }
];