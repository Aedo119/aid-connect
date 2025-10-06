import { useState } from "react";
import api from "../API/api";
import { useParams, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import {
  Check,
  ChevronLeft,
  DollarSign,
  Shirt,
  Cross,
  Apple,
  Home,
  CreditCard,
  Smartphone,
  Building,
  QrCode,
  Info,
  AlertCircle,
  Download,
  Receipt,
  AlertTriangle,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useEffect } from "react";

const donationTypeInfo = {
  money: {
    title: "Financial Donation",
    icon: DollarSign,
    color: "bg-blue-500",
    bgColor: "bg-blue-100",
    textColor: "text-blue-700",
  },
  food: {
    title: "Food Donation",
    icon: Apple,
    color: "bg-green-500",
    bgColor: "bg-green-100",
    textColor: "text-green-700",
  },
  clothes: {
    title: "Clothing Donation",
    icon: Shirt,
    color: "bg-orange-500",
    bgColor: "bg-orange-100",
    textColor: "text-orange-700",
  },
  "medical-supplies": {
    title: "Medical Supplies",
    icon: Cross,
    color: "bg-red-500",
    bgColor: "bg-red-100",
    textColor: "text-red-700",
  },
};

// Medical supplies checklist items
const medicalSuppliesChecklist = [
  "Bandages & Gauze",
  "Antiseptics",
  "Pain Relief Medication",
  "First Aid Kits",
  "Thermometers",
  "Blood Pressure Monitors",
  "Syrringes (unused)",
  "Medical Gloves",
  "Face Masks",
  "Wheelchairs",
  "Crutches",
  "Walking Aids",
];

// Clothing types checklist
const clothingTypes = [
  "Adult Clothing",
  "Children's Clothing",
  "Baby Clothing",
  "Shoes",
  "Accessories",
  "Winter Wear",
  "Professional Wear",
  "Sportswear",
];

export default function DonationConfirmation() {
  const { id, type } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [campaign, setCampaign] = useState([]);
  const [donationType] = useState(type || "money");
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [selectedMedicalItems, setSelectedMedicalItems] = useState([]);
  const [selectedClothingTypes, setSelectedClothingTypes] = useState([]);
  const [donationReference, setDonationReference] = useState("");
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    amount: "",
    customAmount: "",
    paymentMethod: "card",
    cardNumber: "",
    cardExpiry: "",
    cardCvv: "",
    upiId: "",
    foodItems: "",
    foodQuantity: "",
    dropoffLocation: "",
    timeSlot: "",
    medicalItems: "",
    expiryDate: "",
    medicalCondition: "",
    pickupRequested: false,
    clothingType: "",
    clothingCondition: "",
    specialInstructions: "",
    campaign_id: id,
    donor_id: user.id,
  });

  useEffect(() => {
    const getCampaignDet = async () => {
      try {
        console.log("id:", id);
        const result = await api.get(`/campaign/one/${id}`);
        console.log("result", result);
        const firstCampaign = result.data.campaign || null;
        setCampaign(firstCampaign);
        console.log("Fetched campaign:", firstCampaign);
      } catch (err) {
        console.log(err);
      }
    };
    getCampaignDet();
  }, [user]);

  // Validation functions
  const validateStep1 = () => {
    const newErrors = {};

    if (donationType === "money") {
      // Amount validation
      if (!formData.amount && !formData.customAmount) {
        newErrors.amount = "Please select or enter an amount";
      } else if (formData.amount === "custom" && !formData.customAmount) {
        newErrors.customAmount = "Please enter a custom amount";
      } else if (formData.amount === "custom" && formData.customAmount) {
        const amount = parseFloat(formData.customAmount);
        if (isNaN(amount) || amount <= 0) {
          newErrors.customAmount = "Please enter a valid amount greater than 0";
        } else if (amount > 10000) {
          newErrors.customAmount = "Amount cannot exceed $10,000";
        }
      }

      // Payment method specific validations
      if (formData.paymentMethod === "card") {
        if (!formData.cardNumber) {
          newErrors.cardNumber = "Card number is required";
        } 

        if (!formData.cardExpiry) {
          newErrors.cardExpiry = "Expiry date is required";
        } else if (!/^\d{2}\/\d{2}$/.test(formData.cardExpiry)) {
          newErrors.cardExpiry = "Please use MM/YY format";
        } else {
          const [month, year] = formData.cardExpiry.split("/");
          const expiryDate = new Date(2000 + parseInt(year), parseInt(month) - 1);
          const currentDate = new Date();
          if (expiryDate < currentDate) {
            newErrors.cardExpiry = "Card has expired";
          }
        }

        if (!formData.cardCvv) {
          newErrors.cardCvv = "CVV is required";
        } else if (!/^\d{3,4}$/.test(formData.cardCvv)) {
          newErrors.cardCvv = "CVV must be 3 or 4 digits";
        }
      }

      if (formData.paymentMethod === "upi") {
        if (!formData.upiId) {
          newErrors.upiId = "UPI ID is required";
        } else if (!/^[\w.-]+@[\w.-]+$/.test(formData.upiId)) {
          newErrors.upiId = "Please enter a valid UPI ID (e.g., name@upi)";
        }
      }
    }

    if (donationType === "food") {
      if (!formData.foodItems?.trim()) {
        newErrors.foodItems = "Please describe the food items";
      } else if (formData.foodItems.trim().length < 10) {
        newErrors.foodItems = "Please provide more details about the food items";
      }

      if (!formData.foodQuantity?.trim()) {
        newErrors.foodQuantity = "Please specify the quantity";
      }

      if (!formData.dropoffLocation) {
        newErrors.dropoffLocation = "Please select a drop-off location";
      }

      if (!formData.timeSlot) {
        newErrors.timeSlot = "Please select a time slot";
      }
    }

    if (donationType === "clothes") {
      if (selectedClothingTypes.length === 0) {
        newErrors.clothingTypes = "Please select at least one clothing type";
      }

      if (!formData.clothingCondition) {
        newErrors.clothingCondition = "Please select clothing condition";
      }

      if (!formData.dropoffLocation) {
        newErrors.dropoffLocation = "Please select a drop-off location";
      }
    }

    if (donationType === "medical-supplies") {
      if (selectedMedicalItems.length === 0) {
        newErrors.medicalItems = "Please select at least one medical item";
      }

      if (!formData.expiryDate) {
        newErrors.expiryDate = "Please provide the earliest expiry date";
      } else {
        const expiryDate = new Date(formData.expiryDate);
        const sixMonthsFromNow = new Date();
        sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6);
        
        if (expiryDate < sixMonthsFromNow) {
          newErrors.expiryDate = "Items must have at least 6 months before expiry";
        }
      }

      if (!formData.medicalCondition) {
        newErrors.medicalCondition = "Please select medical condition";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    if (!agreeToTerms) {
      setErrors({ terms: "You must agree to the terms to proceed" });
      return false;
    }
    return true;
  };

  // Format card number with spaces
  const formatCardNumber = (value) => {
    const cleaned = value.replace(/\D/g, "");
    const matches = cleaned.match(/\d{1,16}/g);
    const grouped = matches ? matches.join(" ").substr(0, 19) : "";
    return grouped;
  };

  // Format expiry date
  const formatExpiryDate = (value) => {
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length >= 3) {
      return cleaned.substr(0, 2) + "/" + cleaned.substr(2, 2);
    }
    return cleaned;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    let formattedValue = value;
    
    // Apply formatting for specific fields
    if (name === "cardNumber") {
      formattedValue = formatCardNumber(value);
    } else if (name === "cardExpiry") {
      formattedValue = formatExpiryDate(value);
    } else if (name === "cardCvv") {
      formattedValue = value.replace(/\D/g, "").substr(0, 4);
    } else if (name === "customAmount") {
      formattedValue = value.replace(/[^0-9.]/g, "");
    } else if (name === "upiId") {
      formattedValue = value.toLowerCase();
    }

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : formattedValue,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleMedicalItemSelect = (item) => {
    if (selectedMedicalItems.includes(item)) {
      setSelectedMedicalItems(selectedMedicalItems.filter((i) => i !== item));
    } else {
      setSelectedMedicalItems([...selectedMedicalItems, item]);
    }
    // Clear error when user selects an item
    if (errors.medicalItems) {
      setErrors((prev) => ({ ...prev, medicalItems: "" }));
    }
  };

  const handleClothingTypeSelect = (item) => {
    if (selectedClothingTypes.includes(item)) {
      setSelectedClothingTypes(selectedClothingTypes.filter((i) => i !== item));
    } else {
      setSelectedClothingTypes([...selectedClothingTypes, item]);
    }
    // Clear error when user selects an item
    if (errors.clothingTypes) {
      setErrors((prev) => ({ ...prev, clothingTypes: "" }));
    }
  };

  const submitDonation = async () => {
    if (validateStep2()) {
      try {
        let res;
        if (donationType === "money") {
          res = await api.post("donations/money", formData, {
            headers: { "Content-Type": "application/json" },
          });
        } else if (donationType === "food") {
          res = await api.post("donations/food", formData, {
            headers: { "Content-Type": "application/json" },
          });
        } else if (donationType === "medical-supplies") {
          res = await api.post("donations/medical", formData, {
            headers: { "Content-Type": "application/json" },
          });
        } else if (donationType === "clothes") {
          res = await api.post("donations/clothing", formData, {
            headers: { "Content-Type": "application/json" },
          });
        }
        
        // Generate reference ID when confirming donation
        const refId = Math.random().toString(36).substring(2, 10).toUpperCase();
        setDonationReference(refId);
        nextStep();
      } catch (error) {
        console.error("Donation submission failed:", error);
        setErrors({ submit: "Donation submission failed. Please try again." });
      }
    }
  };

  const nextStep = () => {
    if (step === 1 && !validateStep1()) {
      return;
    }
    if (step === 2) {
      // Generate reference ID when confirming donation
      const refId = Math.random().toString(36).substring(2, 10).toUpperCase();
      setDonationReference(refId);
    }
    setStep(step + 1);
  };

  const prevStep = () => setStep(step - 1);

  const donationInfo = donationTypeInfo[donationType];
  const DonationIcon = donationInfo.icon;

  // Generate receipt content (same as before)
  const generateReceiptContent = () => {
    // ... (same receipt generation code as before)
    return `...`;
  };

  // Download receipt as PDF (same as before)
  const downloadReceipt = () => {
    // ... (same download code as before)
  };

  // Print receipt (same as before)
  const printReceipt = () => {
    // ... (same print code as before)
  };

  const renderPaymentMethodFields = () => {
    switch (formData.paymentMethod) {
      case "card":
        return (
          <div className="space-y-4 mt-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Card Number
              </label>
              <input
                type="text"
                name="cardNumber"
                value={formData.cardNumber}
                onChange={handleInputChange}
                placeholder="1234 5678 9012 3456"
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-rose-300 ${
                  errors.cardNumber ? "border-red-500" : "border-gray-300"
                }`}
                maxLength="19"
              />
              {errors.cardNumber && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertTriangle className="h-4 w-4" />
                  {errors.cardNumber}
                </p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expiry Date
                </label>
                <input
                  type="text"
                  name="cardExpiry"
                  value={formData.cardExpiry}
                  onChange={handleInputChange}
                  placeholder="MM/YY"
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-rose-300 ${
                    errors.cardExpiry ? "border-red-500" : "border-gray-300"
                  }`}
                  maxLength="5"
                />
                {errors.cardExpiry && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertTriangle className="h-4 w-4" />
                    {errors.cardExpiry}
                </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CVV
                </label>
                <input
                  type="text"
                  name="cardCvv"
                  value={formData.cardCvv}
                  onChange={handleInputChange}
                  placeholder="123"
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-rose-300 ${
                    errors.cardCvv ? "border-red-500" : "border-gray-300"
                  }`}
                  maxLength="4"
                />
                {errors.cardCvv && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertTriangle className="h-4 w-4" />
                    {errors.cardCvv}
                </p>
                )}
              </div>
            </div>
          </div>
        );

      case "upi":
        return (
          <div className="space-y-4 mt-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                UPI ID
              </label>
              <input
                type="text"
                name="upiId"
                value={formData.upiId}
                onChange={handleInputChange}
                placeholder="yourname@upi"
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-rose-300 ${
                  errors.upiId ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.upiId && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertTriangle className="h-4 w-4" />
                  {errors.upiId}
                </p>
              )}
            </div>
            <div className="text-center text-sm text-gray-600">
              <p>
                You'll be redirected to your UPI app to complete the payment
              </p>
            </div>
          </div>
        );

      case "netbanking":
        return (
          <div className="space-y-4 mt-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Bank
              </label>
              <select 
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-rose-300"
                required
              >
                <option value="">Select your bank</option>
                <option value="sbi">State Bank of India</option>
                <option value="hdfc">HDFC Bank</option>
                <option value="icici">ICICI Bank</option>
                <option value="axis">Axis Bank</option>
                <option value="kotak">Kotak Mahindra Bank</option>
                <option value="yes">Yes Bank</option>
              </select>
            </div>
            <div className="text-center text-sm text-gray-600">
              <p>
                You'll be redirected to your bank's website to complete the
                payment
              </p>
            </div>
          </div>
        );

      case "wallet":
        return (
          <div className="space-y-4 mt-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Wallet
              </label>
              <select 
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-rose-300"
                required
              >
                <option value="">Select your wallet</option>
                <option value="paytm">Paytm</option>
                <option value="phonepe">PhonePe</option>
                <option value="amazonpay">Amazon Pay</option>
                <option value="mobikwik">MobiKwik</option>
              </select>
            </div>
            <div className="text-center text-sm text-gray-600">
              <p>
                You'll be redirected to your wallet app to complete the payment
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const isStep1Valid = () => {
    if (donationType === "money") {
      const hasAmount = formData.amount || (formData.amount === "custom" && formData.customAmount);
      const hasPaymentDetails = formData.paymentMethod === "card" 
        ? formData.cardNumber && formData.cardExpiry && formData.cardCvv
        : formData.paymentMethod === "upi"
        ? formData.upiId
        : true;
      
      return hasAmount && hasPaymentDetails;
    }
    
    if (donationType === "food") {
      return formData.foodItems && formData.foodQuantity && formData.dropoffLocation && formData.timeSlot;
    }
    
    if (donationType === "clothes") {
      return selectedClothingTypes.length > 0 && formData.clothingCondition && formData.dropoffLocation;
    }
    
    if (donationType === "medical-supplies") {
      return selectedMedicalItems.length > 0 && formData.expiryDate && formData.medicalCondition;
    }
    
    return false;
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">
              {donationType === "clothes"
                ? "Clothing Donation"
                : donationType === "food"
                ? "Food Donation"
                : donationType === "medical-supplies"
                ? "Medical Supplies Donation"
                : "Donation Details"}
            </h2>

            {/* Render form based on donation type */}
            {donationType === "money" && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Donation Amount *
                  </label>
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    {[25, 50, 100, 250, 500].map((amount) => (
                      <button
                        key={amount}
                        type="button"
                        className={`py-2 rounded-lg border ${
                          formData.amount === amount.toString()
                            ? "bg-rose-500 text-white border-rose-500"
                            : "bg-white text-gray-700 border-gray-300 hover:border-rose-300"
                        }`}
                        onClick={() =>
                          setFormData({
                            ...formData,
                            amount: amount.toString(),
                            customAmount: "",
                          })
                        }
                      >
                        ${amount}
                      </button>
                    ))}
                  </div>
                  <div>
                    <input
                      type="text"
                      name="customAmount"
                      value={formData.customAmount}
                      onChange={handleInputChange}
                      placeholder="Or enter custom amount"
                      className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-rose-300 ${
                        errors.customAmount ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {errors.amount && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <AlertTriangle className="h-4 w-4" />
                        {errors.amount}
                      </p>
                    )}
                    {errors.customAmount && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <AlertTriangle className="h-4 w-4" />
                        {errors.customAmount}
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Method *
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      className={`p-4 border rounded-lg flex flex-col items-center ${
                        formData.paymentMethod === "card"
                          ? "border-rose-500 bg-rose-50"
                          : "border-gray-300 hover:border-rose-300"
                      }`}
                      onClick={() =>
                        setFormData({ ...formData, paymentMethod: "card" })
                      }
                    >
                      <CreditCard className="h-6 w-6 mb-2 text-gray-700" />
                      <span className="text-sm">Card</span>
                    </button>

                    <button
                      type="button"
                      className={`p-4 border rounded-lg flex flex-col items-center ${
                        formData.paymentMethod === "upi"
                          ? "border-rose-500 bg-rose-50"
                          : "border-gray-300 hover:border-rose-300"
                      }`}
                      onClick={() =>
                        setFormData({ ...formData, paymentMethod: "upi" })
                      }
                    >
                      <QrCode className="h-6 w-6 mb-2 text-gray-700" />
                      <span className="text-sm">UPI</span>
                    </button>

                    <button
                      type="button"
                      className={`p-4 border rounded-lg flex flex-col items-center ${
                        formData.paymentMethod === "netbanking"
                          ? "border-rose-500 bg-rose-50"
                          : "border-gray-300 hover:border-rose-300"
                      }`}
                      onClick={() =>
                        setFormData({
                          ...formData,
                          paymentMethod: "netbanking",
                        })
                      }
                    >
                      <Building className="h-6 w-6 mb-2 text-gray-700" />
                      <span className="text-sm">Net Banking</span>
                    </button>

                    <button
                      type="button"
                      className={`p-4 border rounded-lg flex flex-col items-center ${
                        formData.paymentMethod === "wallet"
                          ? "border-rose-500 bg-rose-50"
                          : "border-gray-300 hover:border-rose-300"
                      }`}
                      onClick={() =>
                        setFormData({ ...formData, paymentMethod: "wallet" })
                      }
                    >
                      <Smartphone className="h-6 w-6 mb-2 text-gray-700" />
                      <span className="text-sm">Wallet</span>
                    </button>
                  </div>

                  {renderPaymentMethodFields()}
                </div>
              </>
            )}

            {donationType === "food" && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Food Items *
                  </label>
                  <textarea
                    name="foodItems"
                    value={formData.foodItems}
                    onChange={handleInputChange}
                    placeholder="List the food items you're donating (e.g., canned goods, rice, pasta)"
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-rose-300 h-20 ${
                      errors.foodItems ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.foodItems && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <AlertTriangle className="h-4 w-4" />
                      {errors.foodItems}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estimated Quantity *
                  </label>
                  <input
                    type="text"
                    name="foodQuantity"
                    value={formData.foodQuantity}
                    onChange={handleInputChange}
                    placeholder="e.g., 20 cans, 5 bags of rice"
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-rose-300 ${
                      errors.foodQuantity ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.foodQuantity && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <AlertTriangle className="h-4 w-4" />
                      {errors.foodQuantity}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Drop-off Location *
                  </label>
                  <select
                    name="dropoffLocation"
                    value={formData.dropoffLocation}
                    onChange={handleInputChange}
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-rose-300 ${
                      errors.dropoffLocation ? "border-red-500" : "border-gray-300"
                    }`}
                  >
                    <option value="">Select drop-off location</option>
                    <option value="central-warehouse">
                      Central Warehouse - 123 Main St
                    </option>
                    <option value="north-distribution">
                      North Distribution Center - 456 Oak Ave
                    </option>
                    <option value="south-community">
                      South Community Center - 789 Pine Rd
                    </option>
                    <option value="east-shelter">
                      East Shelter - 101 Elm Blvd
                    </option>
                  </select>
                  {errors.dropoffLocation && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <AlertTriangle className="h-4 w-4" />
                      {errors.dropoffLocation}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Time Slot *
                  </label>
                  <select
                    name="timeSlot"
                    value={formData.timeSlot}
                    onChange={handleInputChange}
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-rose-300 ${
                      errors.timeSlot ? "border-red-500" : "border-gray-300"
                    }`}
                  >
                    <option value="">Select time</option>
                    <option value="morning">Morning (9 AM - 12 PM)</option>
                    <option value="afternoon">Afternoon (1 PM - 4 PM)</option>
                    <option value="evening">Evening (5 PM - 7 PM)</option>
                  </select>
                  {errors.timeSlot && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <AlertTriangle className="h-4 w-4" />
                      {errors.timeSlot}
                    </p>
                  )}
                </div>

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <div className="flex items-start gap-2 mb-3">
                    <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <h3 className="font-medium text-blue-800">
                      Packing Instructions
                    </h3>
                  </div>
                  <p className="text-sm text-blue-700 mb-2">Please ensure:</p>
                  <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
                    <li>All items are within expiration dates</li>
                    <li>Canned goods are unexpired and unopened</li>
                    <li>Items are packed in clean, sturdy bags or boxes</li>
                    <li>
                      Perishable items are properly refrigerated before drop-off
                    </li>
                    <li>No glass containers (safety policy)</li>
                  </ul>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Special Instructions (Optional)
                  </label>
                  <textarea
                    name="specialInstructions"
                    value={formData.specialInstructions}
                    onChange={handleInputChange}
                    placeholder="Any special handling instructions or notes"
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-rose-300 h-20"
                  />
                </div>
              </>
            )}

            {donationType === "clothes" && (
              <>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Clothing Types *
                  </h3>
                  {errors.clothingTypes && (
                    <p className="text-red-500 text-sm mb-2 flex items-center gap-1">
                      <AlertTriangle className="h-4 w-4" />
                      {errors.clothingTypes}
                    </p>
                  )}
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    {clothingTypes.map((item) => (
                      <div key={item} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`clothing-${item
                            .replace(/\s+/g, "-")
                            .toLowerCase()}`}
                          checked={selectedClothingTypes.includes(item)}
                          onChange={() => handleClothingTypeSelect(item)}
                          className="h-5 w-5 text-rose-500 rounded-full mr-2"
                        />
                        <label
                          htmlFor={`clothing-${item
                            .replace(/\s+/g, "-")
                            .toLowerCase()}`}
                          className="text-sm text-gray-700"
                        >
                          {item}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="text-md font-medium text-gray-700 mb-2">
                    Condition *
                  </h4>
                  <select
                    name="clothingCondition"
                    value={formData.clothingCondition}
                    onChange={handleInputChange}
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-rose-300 ${
                      errors.clothingCondition ? "border-red-500" : "border-gray-300"
                    }`}
                  >
                    <option value="">Select condition</option>
                    <option value="new">New</option>
                    <option value="like-new">Like New</option>
                    <option value="good">Good</option>
                    <option value="fair">Fair</option>
                  </select>
                  {errors.clothingCondition && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <AlertTriangle className="h-4 w-4" />
                      {errors.clothingCondition}
                    </p>
                  )}
                </div>

                <div className="mb-6">
                  <h4 className="text-md font-medium text-gray-700 mb-2">
                    Drop-off Instructions *
                  </h4>
                  <select
                    name="dropoffLocation"
                    value={formData.dropoffLocation}
                    onChange={handleInputChange}
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-rose-300 ${
                      errors.dropoffLocation ? "border-red-500" : "border-gray-300"
                    }`}
                  >
                    <option value="">Select drop-off location</option>
                    <option value="central-warehouse">
                      Central Warehouse - 123 Main St
                    </option>
                    <option value="north-distribution">
                      North Distribution Center - 456 Oak Ave
                    </option>
                    <option value="south-community">
                      South Community Center - 789 Pine Rd
                    </option>
                    <option value="east-shelter">
                      East Shelter - 101 Elm Blvd
                    </option>
                  </select>
                  {errors.dropoffLocation && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <AlertTriangle className="h-4 w-4" />
                      {errors.dropoffLocation}
                    </p>
                  )}
                </div>

                <div className="bg-orange-50 p-4 rounded-lg border border-orange-200 mb-6">
                  <div className="flex items-start gap-2 mb-3">
                    <Info className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                    <h3 className="font-medium text-orange-800">
                      Donation Guidelines:
                    </h3>
                  </div>
                  <ul className="text-sm text-orange-700 space-y-2 list-disc list-inside">
                    <li>Items should be clean and in good condition</li>
                    <li>Please wash all items before donating</li>
                    <li>Sort items by type and size if possible</li>
                    <li>Pack in clean bags or boxes</li>
                    <li>Remove any personal items from pockets</li>
                  </ul>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Special Instructions (Optional)
                  </label>
                  <textarea
                    name="specialInstructions"
                    value={formData.specialInstructions}
                    onChange={handleInputChange}
                    placeholder="Any special notes about your donation"
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-rose-300 h-20"
                  />
                </div>
              </>
            )}

            {donationType === "medical-supplies" && (
              <>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Medical Supplies Checklist *
                  </h3>
                  {errors.medicalItems && (
                    <p className="text-red-500 text-sm mb-2 flex items-center gap-1">
                      <AlertTriangle className="h-4 w-4" />
                      {errors.medicalItems}
                    </p>
                  )}
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    {medicalSuppliesChecklist.map((item) => (
                      <div key={item} className="flex items-center">
                        <input
                          type="checkbox"
                          id={item.replace(/\s+/g, "-").toLowerCase()}
                          checked={selectedMedicalItems.includes(item)}
                          onChange={() => handleMedicalItemSelect(item)}
                          className="h-5 w-5 text-rose-500 rounded-full mr-2"
                        />
                        <label
                          htmlFor={item.replace(/\s+/g, "-").toLowerCase()}
                          className="text-sm text-gray-700"
                        >
                          {item}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-red-50 p-4 rounded-lg border border-red-200 mb-6">
                  <div className="flex items-start gap-2 mb-3">
                    <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                    <h3 className="font-medium text-red-800">
                      Expiry Date Validation *
                    </h3>
                  </div>
                  <p className="text-sm text-red-700 mb-2 font-medium">
                    Important:
                  </p>
                  <p className="text-sm text-red-700 mb-3">
                    All medical supplies must have at least 6 months before
                    expiration. Items past expiry cannot be accepted for safety
                    reasons.
                  </p>
                  <div>
                    <label className="block text-sm font-medium text-red-700 mb-2">
                      Earliest Expiry Date of Items *
                    </label>
                    <input
                      type="date"
                      name="expiryDate"
                      value={formData.expiryDate}
                      onChange={handleInputChange}
                      className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-300 bg-white ${
                        errors.expiryDate ? "border-red-500" : "border-red-300"
                      }`}
                    />
                    {errors.expiryDate && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <AlertTriangle className="h-4 w-4" />
                        {errors.expiryDate}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Condition & Storage *
                  </label>
                  <select
                    name="medicalCondition"
                    value={formData.medicalCondition}
                    onChange={handleInputChange}
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-rose-300 ${
                      errors.medicalCondition ? "border-red-500" : "border-gray-300"
                    }`}
                  >
                    <option value="">Select condition</option>
                    <option value="new-unopened">New & Unopened</option>
                    <option value="sterile">Sterile & Sealed</option>
                    <option value="good">Good Condition</option>
                    <option value="requires-special-handling">
                      Requires Special Handling
                    </option>
                  </select>
                  {errors.medicalCondition && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <AlertTriangle className="h-4 w-4" />
                      {errors.medicalCondition}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 mb-6">
                  <input
                    type="checkbox"
                    id="pickupRequestedMedical"
                    name="pickupRequested"
                    checked={formData.pickupRequested}
                    onChange={handleInputChange}
                    className="h-5 w-5 text-rose-500 rounded-full"
                  />
                  <label
                    htmlFor="pickupRequestedMedical"
                    className="text-sm text-gray-700"
                  >
                    Request pickup service (for large or heavy items)
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Special Instructions
                  </label>
                  <textarea
                    name="specialInstructions"
                    value={formData.specialInstructions}
                    onChange={handleInputChange}
                    placeholder="Storage requirements, handling instructions, or other important notes"
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-rose-300 h-20"
                  />
                </div>
              </>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => navigate(`/campaigns/${id}`)}
                className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                Back to Campaign
              </button>
              <button
                onClick={nextStep}
                className={`flex-1 py-3 rounded-lg transition ${
                  isStep1Valid()
                    ? "bg-rose-500 text-white hover:bg-rose-600"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
                disabled={!isStep1Valid()}
              >
                Continue
              </button>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Confirm Your Donation
            </h2>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-semibold text-lg mb-4">Donation Summary</h3>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Campaign:</span>
                  <span className="font-medium">{campaign?.title}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Donation Type:</span>
                  <span className="font-medium">{donationInfo.title}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Date:</span>
                  <span className="font-medium">
                    {new Date().toLocaleDateString()}
                  </span>
                </div>

                {/* Show details based on donation type */}
                {donationType === "money" && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Amount:</span>
                      <span className="font-medium">
                        $
                        {formData.amount === "custom"
                          ? formData.customAmount
                          : formData.amount}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment Method:</span>
                      <span className="font-medium capitalize">
                        {formData.paymentMethod === "card" &&
                          "Credit/Debit Card"}
                        {formData.paymentMethod === "upi" && "UPI"}
                        {formData.paymentMethod === "netbanking" &&
                          "Net Banking"}
                        {formData.paymentMethod === "wallet" && "Wallet"}
                      </span>
                    </div>
                  </>
                )}

                {donationType === "food" && (
                  <>
                    {formData.foodItems && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Food Items:</span>
                        <span className="font-medium">
                          {formData.foodItems}
                        </span>
                      </div>
                    )}
                    {formData.foodQuantity && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Quantity:</span>
                        <span className="font-medium">
                          {formData.foodQuantity}
                        </span>
                      </div>
                    )}
                    {formData.dropoffLocation && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          Drop-off Location:
                        </span>
                        <span className="font-medium capitalize">
                          {formData.dropoffLocation === "central-warehouse" &&
                            "Central Warehouse"}
                          {formData.dropoffLocation === "north-distribution" &&
                            "North Distribution Center"}
                          {formData.dropoffLocation === "south-community" &&
                            "South Community Center"}
                          {formData.dropoffLocation === "east-shelter" &&
                            "East Shelter"}
                        </span>
                      </div>
                    )}
                    {formData.timeSlot && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Time Slot:</span>
                        <span className="font-medium capitalize">
                          {formData.timeSlot === "morning" &&
                            "Morning (9 AM - 12 PM)"}
                          {formData.timeSlot === "afternoon" &&
                            "Afternoon (1 PM - 4 PM)"}
                          {formData.timeSlot === "evening" &&
                            "Evening (5 PM - 7 PM)"}
                        </span>
                      </div>
                    )}
                  </>
                )}

                {donationType === "clothes" && (
                  <>
                    {selectedClothingTypes.length > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Clothing Types:</span>
                        <span className="font-medium text-right">
                          {selectedClothingTypes.join(", ")}
                        </span>
                      </div>
                    )}
                    {formData.clothingCondition && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Condition:</span>
                        <span className="font-medium capitalize">
                          {formData.clothingCondition}
                        </span>
                      </div>
                    )}
                    {formData.dropoffLocation && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          Drop-off Location:
                        </span>
                        <span className="font-medium capitalize">
                          {formData.dropoffLocation === "central-warehouse" &&
                            "Central Warehouse"}
                          {formData.dropoffLocation === "north-distribution" &&
                            "North Distribution Center"}
                          {formData.dropoffLocation === "south-community" &&
                            "South Community Center"}
                          {formData.dropoffLocation === "east-shelter" &&
                            "East Shelter"}
                        </span>
                      </div>
                    )}
                  </>
                )}

                {donationType === "medical-supplies" && (
                  <>
                    {selectedMedicalItems.length > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Medical Items:</span>
                        <span className="font-medium text-right">
                          {selectedMedicalItems.join(", ")}
                        </span>
                      </div>
                    )}
                    {formData.expiryDate && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          Earliest Expiry Date:
                        </span>
                        <span className="font-medium">
                          {formData.expiryDate}
                        </span>
                      </div>
                    )}
                    {formData.medicalCondition && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Condition:</span>
                        <span className="font-medium capitalize">
                          {formData.medicalCondition === "new-unopened" &&
                            "New & Unopened"}
                          {formData.medicalCondition === "sterile" &&
                            "Sterile & Sealed"}
                          {formData.medicalCondition === "good" &&
                            "Good Condition"}
                          {formData.medicalCondition ===
                            "requires-special-handling" &&
                            "Requires Special Handling"}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-600">Pickup Requested:</span>
                      <span className="font-medium">
                        {formData.pickupRequested ? "Yes" : "No"}
                      </span>
                    </div>
                  </>
                )}

                {formData.specialInstructions && (
                  <div className="pt-3 border-t">
                    <div className="text-gray-600 mb-1">
                      Special Instructions:
                    </div>
                    <div className="font-medium">
                      {formData.specialInstructions}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <label className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={agreeToTerms}
                onChange={() => {
                  setAgreeToTerms(!agreeToTerms);
                  if (errors.terms) {
                    setErrors((prev) => ({ ...prev, terms: "" }));
                  }
                }}
                className={`mt-1 h-5 w-5 text-rose-500 rounded-full ${
                  errors.terms ? "border-red-500" : ""
                }`}
              />
              <span className="text-sm text-gray-700">
                I confirm that all information provided is accurate and I agree
                to the terms of this donation.
              </span>
            </label>
            {errors.terms && (
              <p className="text-red-500 text-sm flex items-center gap-1">
                <AlertTriangle className="h-4 w-4" />
                {errors.terms}
              </p>
            )}

            {errors.submit && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-700 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  {errors.submit}
                </p>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={prevStep}
                className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                Back
              </button>
              <button
                onClick={submitDonation}
                disabled={!agreeToTerms}
                className={`flex-1 py-3 rounded-lg transition ${
                  agreeToTerms
                    ? "bg-rose-500 text-white hover:bg-rose-600"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                Confirm Donation
              </button>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="text-center space-y-6">
            <div className="bg-green-100 text-green-800 p-6 rounded-lg">
              <Check className="h-16 w-16 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">
                Thank You for Your Donation!
              </h2>
              <p>Your contribution will make a significant impact.</p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg text-left">
              <h3 className="font-semibold text-lg mb-4">Donation Confirmed</h3>
              <div className="space-y-2">
                <p>
                  <strong>Campaign:</strong>{" "}
                  {campaign ? campaign.title : "Loading..."}
                </p>
                <p>
                  <strong>Donation Type:</strong> {donationInfo.title}
                </p>
                <p>
                  <strong>Date:</strong> {new Date().toLocaleDateString()}
                </p>
                <p>
                  <strong>Reference ID:</strong> {donationReference}
                </p>

                {/* Show details based on donation type */}
                {donationType === "money" && (
                  <p>
                    <strong>Amount:</strong> $
                    {formData.amount === "custom"
                      ? formData.customAmount
                      : formData.amount}
                  </p>
                )}

                {donationType === "food" && formData.dropoffLocation && (
                  <p>
                    <strong>Drop-off Location:</strong>
                    {formData.dropoffLocation === "central-warehouse" &&
                      " Central Warehouse"}
                    {formData.dropoffLocation === "north-distribution" &&
                      " North Distribution Center"}
                    {formData.dropoffLocation === "south-community" &&
                      " South Community Center"}
                    {formData.dropoffLocation === "east-shelter" &&
                      " East Shelter"}
                  </p>
                )}

                {donationType === "medical-supplies" &&
                  formData.pickupRequested && (
                    <p>
                      <strong>Pickup Service:</strong> Requested
                    </p>
                  )}
              </div>
            </div>

            {/* Receipt Actions */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Receipt className="h-6 w-6 text-rose-500" />
                <h3 className="text-lg font-semibold text-gray-800">
                  Download Your Receipt
                </h3>
              </div>
              <p className="text-gray-600 mb-4">
                Keep this receipt for your records. It may be useful for tax
                purposes or tracking your donations.
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={downloadReceipt}
                  className="flex items-center gap-2 bg-rose-500 text-white px-6 py-3 rounded-lg hover:bg-rose-600 transition"
                >
                  <Download className="h-4 w-4" />
                  Download Receipt
                </button>
                <button
                  onClick={printReceipt}
                  className="flex items-center gap-2 border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition"
                >
                  <Receipt className="h-4 w-4" />
                  Print Receipt
                </button>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => navigate("/campaigns")}
                className="flex-1 bg-gray-500 text-white py-3 rounded-lg hover:bg-gray-600 transition flex items-center justify-center gap-2"
              >
                <Home className="h-4 w-4" />
                Back to Campaigns
              </button>
              <button
                onClick={() => navigate("/")}
                className="flex-1 bg-rose-500 text-white py-3 rounded-lg hover:bg-rose-600 transition"
              >
                Back to Home
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-green-200 via-teal-400 to-rose-400">
      {/* Progress Bar - Updated for 3 steps */}
      <div className="w-full bg-white/30 backdrop-blur-sm">
        <div className="mx-auto max-w-4xl px-4 py-2">
          <div className="flex items-center justify-between relative">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex flex-col items-center z-10">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    i < step
                      ? "bg-rose-500 text-white"
                      : i === step
                      ? "bg-white text-rose-500 border-2 border-rose-500"
                      : "bg-white/50 text-gray-400"
                  }`}
                >
                  {i < step ? <Check className="h-4 w-4" /> : i}
                </div>
                <span
                  className={`text-xs mt-1 ${
                    i <= step ? "text-gray-800 font-medium" : "text-gray-600"
                  }`}
                >
                  {i === 1 && "Details"}
                  {i === 2 && "Confirm"}
                  {i === 3 && "Complete"}
                </span>
              </div>
            ))}
            <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-white/50 -translate-y-1/2 -z-10" />
            <div
              className="absolute top-1/2 left-4 h-0.5 bg-rose-500 -translate-y-1/2 -z-10 transition-all duration-500"
              style={{ width: `${((step - 1) / 2) * 92}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-xl w-full max-w-2xl">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={
                step === 1 ? () => navigate(`/campaigns/${id}`) : prevStep
              }
              className="p-2 rounded-lg hover:bg-gray-100 transition"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-800">
                {campaign ? campaign.title : "Loading..."}
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <div className={`p-2 rounded-full ${donationInfo.bgColor}`}>
                  <DonationIcon
                    className={`h-4 w-4 ${donationInfo.textColor}`}
                  />
                </div>
                <span className="text-sm text-gray-600">
                  {donationInfo.title}
                </span>
              </div>
            </div>
          </div>

          {/* Step Content */}
          {renderStep()}
        </div>
      </div>

      <Footer />
    </div>
  );
}