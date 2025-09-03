import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import { campaigns } from "../data/campaigns";
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
  Info
} from 'lucide-react';

const donationTypeInfo = {
  money: {
    title: 'Financial Donation',
    icon: DollarSign,
    color: 'bg-blue-500',
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-700'
  },
  food: {
    title: 'Food Donation',
    icon: Apple,
    color: 'bg-green-500',
    bgColor: 'bg-green-100',
    textColor: 'text-green-700'
  },
  clothes: {
    title: 'Clothing Donation',
    icon: Shirt,
    color: 'bg-orange-500',
    bgColor: 'bg-orange-100',
    textColor: 'text-orange-700'
  },
  'medical supplies': {
    title: 'Medical Supplies',
    icon: Cross,
    color: 'bg-red-500',
    bgColor: 'bg-red-100',
    textColor: 'text-red-700'
  }
};

export default function DonationConfirmation() {
  const { id, type } = useParams();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [donationType] = useState(type || 'money');
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    customAmount: '',
    paymentMethod: 'card',
    cardNumber: '',
    cardExpiry: '',
    cardCvv: '',
    upiId: '',
    foodItems: '',
    foodQuantity: '',
    dropoffLocation: '',
    timeSlot: '',
    medicalItems: '',
    expiryDate: '',
    medicalCondition: '',
    pickupRequested: false,
    clothingType: '',
    clothingCondition: '',
    specialInstructions: ''
  });

  const campaign = campaigns.find(c => c.id === parseInt(id)) || campaigns[0];
  const donationInfo = donationTypeInfo[donationType];
  const DonationIcon = donationInfo.icon;

  // Check if the selected donation type is available for this campaign
  const isDonationTypeAvailable = campaign.donationTypes.includes(donationType);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const renderPaymentMethodFields = () => {
    switch(formData.paymentMethod) {
      case 'card':
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
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-rose-300"
                maxLength="19"
              />
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
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-rose-300"
                  maxLength="5"
                />
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
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-rose-300"
                  maxLength="3"
                />
              </div>
            </div>
          </div>
        );
      
      case 'upi':
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
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-rose-300"
              />
            </div>
            <div className="text-center text-sm text-gray-600">
              <p>You'll be redirected to your UPI app to complete the payment</p>
            </div>
          </div>
        );
      
      case 'netbanking':
        return (
          <div className="space-y-4 mt-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Bank
              </label>
              <select className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-rose-300">
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
              <p>You'll be redirected to your bank's website to complete the payment</p>
            </div>
          </div>
        );
      
      case 'wallet':
        return (
          <div className="space-y-4 mt-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Wallet
              </label>
              <select className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-rose-300">
                <option value="">Select your wallet</option>
                <option value="paytm">Paytm</option>
                <option value="phonepe">PhonePe</option>
                <option value="amazonpay">Amazon Pay</option>
                <option value="mobikwik">MobiKwik</option>
              </select>
            </div>
            <div className="text-center text-sm text-gray-600">
              <p>You'll be redirected to your wallet app to complete the payment</p>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  const renderStep = () => {
    switch(step) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Food Donation Details</h2>
            
            {/* Show error if donation type is not available for this campaign */}
            {!isDonationTypeAvailable && (
              <div className="bg-red-100 text-red-800 p-4 rounded-lg">
                <p>This campaign does not accept {donationInfo.title.toLowerCase()} donations.</p>
                <button
                  onClick={() => navigate(`/campaigns/${id}`)}
                  className="mt-2 text-red-700 underline"
                >
                  Return to campaign page to choose a different donation type
                </button>
              </div>
            )}
            
            {/* Render form based on donation type */}
            {donationType === 'money' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Donation Amount
                  </label>
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    {[25, 50, 100, 250, 500].map(amount => (
                      <button
                        key={amount}
                        type="button"
                        className={`py-2 rounded-lg border ${
                          formData.amount === amount.toString()
                            ? 'bg-rose-500 text-white border-rose-500'
                            : 'bg-white text-gray-700 border-gray-300 hover:border-rose-300'
                        }`}
                        onClick={() => setFormData({...formData, amount: amount.toString()})}
                      >
                        ${amount}
                      </button>
                    ))}
                  </div>
                  <input
                    type="number"
                    name="customAmount"
                    value={formData.customAmount}
                    onChange={handleInputChange}
                    placeholder="Or enter custom amount"
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-rose-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Method
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      className={`p-4 border rounded-lg flex flex-col items-center ${
                        formData.paymentMethod === 'card' 
                          ? 'border-rose-500 bg-rose-50' 
                          : 'border-gray-300 hover:border-rose-300'
                      }`}
                      onClick={() => setFormData({...formData, paymentMethod: 'card'})}
                    >
                      <CreditCard className="h-6 w-6 mb-2 text-gray-700" />
                      <span className="text-sm">Card</span>
                    </button>
                    
                    <button
                      type="button"
                      className={`p-4 border rounded-lg flex flex-col items-center ${
                        formData.paymentMethod === 'upi' 
                          ? 'border-rose-500 bg-rose-50' 
                          : 'border-gray-300 hover:border-rose-300'
                      }`}
                      onClick={() => setFormData({...formData, paymentMethod: 'upi'})}
                    >
                      <QrCode className="h-6 w-6 mb-2 text-gray-700" />
                      <span className="text-sm">UPI</span>
                    </button>
                    
                    <button
                      type="button"
                      className={`p-4 border rounded-lg flex flex-col items-center ${
                        formData.paymentMethod === 'netbanking' 
                          ? 'border-rose-500 bg-rose-50' 
                          : 'border-gray-300 hover:border-rose-300'
                      }`}
                      onClick={() => setFormData({...formData, paymentMethod: 'netbanking'})}
                    >
                      <Building className="h-6 w-6 mb-2 text-gray-700" />
                      <span className="text-sm">Net Banking</span>
                    </button>
                    
                    <button
                      type="button"
                      className={`p-4 border rounded-lg flex flex-col items-center ${
                        formData.paymentMethod === 'wallet' 
                          ? 'border-rose-500 bg-rose-50' 
                          : 'border-gray-300 hover:border-rose-300'
                      }`}
                      onClick={() => setFormData({...formData, paymentMethod: 'wallet'})}
                    >
                      <Smartphone className="h-6 w-6 mb-2 text-gray-700" />
                      <span className="text-sm">Wallet</span>
                    </button>
                  </div>
                  
                  {renderPaymentMethodFields()}
                </div>
              </>
            )}
            
            {donationType === 'food' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Food Items
                  </label>
                  <textarea
                    name="foodItems"
                    value={formData.foodItems}
                    onChange={handleInputChange}
                    placeholder="List the food items you're donating (e.g., canned goods, rice, pasta)"
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-rose-300 h-20"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estimated Quantity
                  </label>
                  <input
                    type="text"
                    name="foodQuantity"
                    value={formData.foodQuantity}
                    onChange={handleInputChange}
                    placeholder="e.g., 20 cans, 5 bags of rice"
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-rose-300"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Drop-off Location
                  </label>
                  <select
                    name="dropoffLocation"
                    value={formData.dropoffLocation}
                    onChange={handleInputChange}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-rose-300"
                  >
                    <option value="">Select drop-off location</option>
                    <option value="central-warehouse">Central Warehouse - 123 Main St</option>
                    <option value="north-distribution">North Distribution Center - 456 Oak Ave</option>
                    <option value="south-community">South Community Center - 789 Pine Rd</option>
                    <option value="east-shelter">East Shelter - 101 Elm Blvd</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Time Slot
                  </label>
                  <select
                    name="timeSlot"
                    value={formData.timeSlot}
                    onChange={handleInputChange}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-rose-300"
                  >
                    <option value="">Select time</option>
                    <option value="morning">Morning (9 AM - 12 PM)</option>
                    <option value="afternoon">Afternoon (1 PM - 4 PM)</option>
                    <option value="evening">Evening (5 PM - 7 PM)</option>
                  </select>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <div className="flex items-start gap-2 mb-3">
                    <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <h3 className="font-medium text-blue-800">Packing Instructions</h3>
                  </div>
                  <p className="text-sm text-blue-700 mb-2">Please ensure:</p>
                  <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
                    <li>All items are within expiration dates</li>
                    <li>Canned goods are unexpired and unopened</li>
                    <li>Items are packed in clean, sturdy bags or boxes</li>
                    <li>Perishable items are properly refrigerated before drop-off</li>
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
            
            {donationType === 'clothes' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type of Clothing
                  </label>
                  <input
                    type="text"
                    name="clothingType"
                    value={formData.clothingType}
                    onChange={handleInputChange}
                    placeholder="e.g., winter coats, children's clothes, etc."
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-rose-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Condition
                  </label>
                  <select
                    name="clothingCondition"
                    value={formData.clothingCondition}
                    onChange={handleInputChange}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-rose-300"
                  >
                    <option value="">Select condition</option>
                    <option value="new">New</option>
                    <option value="like-new">Like New</option>
                    <option value="good">Good</option>
                    <option value="fair">Fair</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="pickupRequested"
                    name="pickupRequested"
                    checked={formData.pickupRequested}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-rose-500 rounded"
                  />
                  <label htmlFor="pickupRequested" className="text-sm text-gray-700">
                    I need pickup service for my donation
                  </label>
                </div>
              </>
            )}
            
            {donationType === 'medical-supplies' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Medical Items
                  </label>
                  <textarea
                    name="medicalItems"
                    value={formData.medicalItems}
                    onChange={handleInputChange}
                    placeholder="List the medical supplies you're donating"
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-rose-300 h-20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expiry Date (if applicable)
                  </label>
                  <input
                    type="date"
                    name="expiryDate"
                    value={formData.expiryDate}
                    onChange={handleInputChange}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-rose-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Special Handling Requirements
                  </label>
                  <textarea
                    name="specialInstructions"
                    value={formData.specialInstructions}
                    onChange={handleInputChange}
                    placeholder="Any special handling or storage requirements"
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
                disabled={!isDonationTypeAvailable}
                className={`flex-1 py-3 rounded-lg transition ${
                  isDonationTypeAvailable 
                    ? 'bg-rose-500 text-white hover:bg-rose-600' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Continue
              </button>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Confirm Your Donation</h2>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-semibold text-lg mb-4">Donation Summary</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Campaign:</span>
                  <span className="font-medium">{campaign.title}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Donation Type:</span>
                  <span className="font-medium">{donationInfo.title}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Date:</span>
                  <span className="font-medium">{new Date().toLocaleDateString()}</span>
                </div>

                {/* Show details based on donation type */}
                {donationType === 'money' && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Amount:</span>
                      <span className="font-medium">
                        ${formData.amount === 'custom' ? formData.customAmount : formData.amount}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment Method:</span>
                      <span className="font-medium capitalize">
                        {formData.paymentMethod === 'card' && 'Credit/Debit Card'}
                        {formData.paymentMethod === 'upi' && 'UPI'}
                        {formData.paymentMethod === 'netbanking' && 'Net Banking'}
                        {formData.paymentMethod === 'wallet' && 'Wallet'}
                      </span>
                    </div>
                  </>
                )}
                
                {donationType === 'food' && (
                  <>
                    {formData.foodItems && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Food Items:</span>
                        <span className="font-medium">{formData.foodItems}</span>
                      </div>
                    )}
                    {formData.foodQuantity && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Quantity:</span>
                        <span className="font-medium">{formData.foodQuantity}</span>
                      </div>
                    )}
                    {formData.dropoffLocation && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Drop-off Location:</span>
                        <span className="font-medium capitalize">
                          {formData.dropoffLocation === 'central-warehouse' && 'Central Warehouse'}
                          {formData.dropoffLocation === 'north-distribution' && 'North Distribution Center'}
                          {formData.dropoffLocation === 'south-community' && 'South Community Center'}
                          {formData.dropoffLocation === 'east-shelter' && 'East Shelter'}
                        </span>
                      </div>
                    )}
                    {formData.timeSlot && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Time Slot:</span>
                        <span className="font-medium capitalize">
                          {formData.timeSlot === 'morning' && 'Morning (9 AM - 12 PM)'}
                          {formData.timeSlot === 'afternoon' && 'Afternoon (1 PM - 4 PM)'}
                          {formData.timeSlot === 'evening' && 'Evening (5 PM - 7 PM)'}
                        </span>
                      </div>
                    )}
                  </>
                )}
                
                {donationType === 'clothes' && (
                  <>
                    {formData.clothingType && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Clothing Type:</span>
                        <span className="font-medium">{formData.clothingType}</span>
                      </div>
                    )}
                    {formData.clothingCondition && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Condition:</span>
                        <span className="font-medium capitalize">{formData.clothingCondition}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-600">Pickup Requested:</span>
                      <span className="font-medium">{formData.pickupRequested ? 'Yes' : 'No'}</span>
                    </div>
                  </>
                )}
                
                {donationType === 'medical-supplies' && formData.medicalItems && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Medical Items:</span>
                      <span className="font-medium">{formData.medicalItems}</span>
                    </div>
                    {formData.expiryDate && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Expiry Date:</span>
                        <span className="font-medium">{formData.expiryDate}</span>
                      </div>
                    )}
                  </>
                )}
                
                {formData.specialInstructions && (
                  <div className="pt-3 border-t">
                    <div className="text-gray-600 mb-1">Special Instructions:</div>
                    <div className="font-medium">{formData.specialInstructions}</div>
                  </div>
                )}
              </div>
            </div>

            <label className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={agreeToTerms}
                onChange={() => setAgreeToTerms(!agreeToTerms)}
                className="mt-1 h-4 w-4 text-rose-500 rounded"
              />
              <span className="text-sm text-gray-700">
                I confirm that all information provided is accurate and I agree to the terms of this donation.
              </span>
            </label>

            <div className="flex gap-3">
              <button
                onClick={prevStep}
                className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                Back
              </button>
              <button
                onClick={nextStep}
                disabled={!agreeToTerms}
                className={`flex-1 py-3 rounded-lg transition ${
                  agreeToTerms 
                    ? 'bg-rose-500 text-white hover:bg-rose-600' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
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
              <h2 className="text-2xl font-bold mb-2">Thank You for Your Donation!</h2>
              <p>Your contribution will make a significant impact.</p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg text-left">
              <h3 className="font-semibold text-lg mb-4">Donation Confirmed</h3>
              <div className="space-y-2">
                <p><strong>Campaign:</strong> {campaign.title}</p>
                <p><strong>Donation Type:</strong> {donationInfo.title}</p>
                <p><strong>Date:</strong> {new Date().toLocaleDateString()}</p>
                <p><strong>Reference ID:</strong> {Math.random().toString(36).substring(2, 10).toUpperCase()}</p>
                
                {/* Show details based on donation type */}
                {donationType === 'money' && (
                  <p><strong>Amount:</strong> ${formData.amount === 'custom' ? formData.customAmount : formData.amount}</p>
                )}
                
                {donationType === 'food' && formData.dropoffLocation && (
                  <p><strong>Drop-off Location:</strong> 
                    {formData.dropoffLocation === 'central-warehouse' && ' Central Warehouse'}
                    {formData.dropoffLocation === 'north-distribution' && ' North Distribution Center'}
                    {formData.dropoffLocation === 'south-community' && ' South Community Center'}
                    {formData.dropoffLocation === 'east-shelter' && ' East Shelter'}
                  </p>
                )}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => navigate('/campaigns')}
                className="flex-1 bg-gray-500 text-white py-3 rounded-lg hover:bg-gray-600 transition flex items-center justify-center gap-2"
              >
                <Home className="h-4 w-4" />
                Back to Campaigns
              </button>
              <button
                onClick={() => navigate('/')}
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
            {[1, 2, 3].map(i => (
              <div key={i} className="flex flex-col items-center z-10">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  i < step ? 'bg-rose-500 text-white' : 
                  i === step ? 'bg-white text-rose-500 border-2 border-rose-500' : 
                  'bg-white/50 text-gray-400'
                }`}>
                  {i < step ? <Check className="h-4 w-4" /> : i}
                </div>
                <span className={`text-xs mt-1 ${
                  i <= step ? 'text-gray-800 font-medium' : 'text-gray-600'
                }`}>
                  {i === 1 && 'Details'}
                  {i === 2 && 'Confirm'}
                  {i === 3 && 'Complete'}
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
              onClick={step === 1 ? () => navigate(`/campaigns/${id}`) : prevStep}
              className="p-2 rounded-lg hover:bg-gray-100 transition"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-800">{campaign.title}</h1>
              <div className="flex items-center gap-2 mt-1">
                <div className={`p-2 rounded-full ${donationInfo.bgColor}`}>
                  <DonationIcon className={`h-4 w-4 ${donationInfo.textColor}`} />
                </div>
                <span className="text-sm text-gray-600">{donationInfo.title}</span>
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