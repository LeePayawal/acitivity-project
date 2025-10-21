"use client";

import { useState } from "react";
import { Check, X, Zap, TrendingUp, Crown, Star, ArrowRight, CreditCard, Lock } from "lucide-react";

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const [showPayment, setShowPayment] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [processing, setProcessing] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");

  const plans = [
    {
      id: "bronze",
      name: "Bronze",
      tier: "bronze",
      icon: Star,
      description: "Perfect for testing and small projects",
      monthlyPrice: 0,
      yearlyPrice: 0,
      rateLimit: "100 requests / 10 seconds",
      color: "from-amber-700 to-amber-900",
      borderColor: "border-amber-700",
      bgColor: "bg-gradient-to-br from-amber-950/30 to-gray-950",
      features: [
        { name: "100 requests per 10 seconds", included: true },
        { name: "Basic API endpoints", included: true },
        { name: "1 API key", included: true },
        { name: "Community support", included: true },
        { name: "Standard documentation", included: true },
        { name: "Advanced analytics", included: false },
        { name: "Priority support", included: false },
        { name: "Custom rate limits", included: false },
      ],
      cta: "Start Free",
      popular: false
    },
    {
      id: "silver",
      name: "Silver",
      tier: "silver",
      icon: Zap,
      description: "For growing applications and businesses",
      monthlyPrice: 49,
      yearlyPrice: 470,
      rateLimit: "1,000 requests / 10 seconds",
      color: "from-gray-400 to-gray-600",
      borderColor: "border-gray-500",
      bgColor: "bg-gradient-to-br from-gray-800/40 to-gray-950",
      features: [
        { name: "1,000 requests per 10 seconds", included: true },
        { name: "All API endpoints", included: true },
        { name: "5 API keys", included: true },
        { name: "Email support (24h response)", included: true },
        { name: "Advanced documentation", included: true },
        { name: "Advanced analytics dashboard", included: true },
        { name: "Webhook notifications", included: true },
        { name: "Priority support", included: false },
      ],
      cta: "Upgrade to Silver",
      popular: true
    },
    {
      id: "gold",
      name: "Gold",
      tier: "gold",
      icon: TrendingUp,
      description: "For high-traffic applications",
      monthlyPrice: 149,
      yearlyPrice: 1490,
      rateLimit: "5,000 requests / 10 seconds",
      color: "from-yellow-500 to-yellow-700",
      borderColor: "border-yellow-600",
      bgColor: "bg-gradient-to-br from-yellow-950/30 to-gray-950",
      features: [
        { name: "5,000 requests per 10 seconds", included: true },
        { name: "All API endpoints", included: true },
        { name: "15 API keys", included: true },
        { name: "Priority support (4h response)", included: true },
        { name: "White-label documentation", included: true },
        { name: "Advanced analytics dashboard", included: true },
        { name: "Webhook notifications", included: true },
        { name: "Custom rate limit adjustment", included: true },
      ],
      cta: "Upgrade to Gold",
      popular: false
    },
    {
      id: "platinum",
      name: "Platinum",
      tier: "platinum",
      icon: Crown,
      description: "For enterprise-level applications",
      monthlyPrice: 399,
      yearlyPrice: 3990,
      rateLimit: "Unlimited requests",
      color: "from-purple-400 to-purple-600",
      borderColor: "border-purple-500",
      bgColor: "bg-gradient-to-br from-purple-950/40 to-gray-950",
      features: [
        { name: "Unlimited requests", included: true },
        { name: "All API endpoints", included: true },
        { name: "Unlimited API keys", included: true },
        { name: "Priority support (1h response)", included: true },
        { name: "White-label documentation", included: true },
        { name: "Advanced analytics dashboard", included: true },
        { name: "Webhook notifications", included: true },
        { name: "Custom integrations", included: true },
        { name: "Dedicated account manager", included: true },
      ],
      cta: "Upgrade to Platinum",
      popular: false
    }
  ];

  const handleSelectPlan = (plan: any) => {
    if (plan.monthlyPrice === 0) {
      alert("Free plan activated!");
      return;
    }
    setSelectedPlan(plan);
    setShowPayment(true);
  };

  const handlePayment = async () => {
    if (!cardNumber || !cardExpiry || !cardCvc) {
      alert("Please fill in all payment details");
      return;
    }

    setProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    try {
      // Save subscription to database
      const response = await fetch("/api/subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tier: selectedPlan.tier,
          billingCycle,
          amount: billingCycle === "monthly" ? selectedPlan.monthlyPrice : selectedPlan.yearlyPrice,
        }),
      });

      if (response.ok) {
        alert(`Successfully subscribed to ${selectedPlan.name} plan! 🎉`);
        setShowPayment(false);
        setCardNumber("");
        setCardExpiry("");
        setCardCvc("");
      } else {
        alert("Subscription failed. Please try again.");
      }
    } catch (error) {
      alert("Payment processing error. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, "");
    const formatted = cleaned.match(/.{1,4}/g)?.join(" ") || cleaned;
    return formatted.slice(0, 19);
  };

  const formatExpiry = (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2) + "/" + cleaned.slice(2, 4);
    }
    return cleaned;
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-gray-900">
      <div className="h-16"></div>
      
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-gray-800/50 to-gray-900/50 border border-gray-700 rounded-full text-gray-300 text-sm font-medium mb-6 backdrop-blur-sm">
            🚀 API Rate Limit Subscriptions
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            Scale Your
            <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent"> API Access</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8">
            Choose the perfect rate limit plan for your application's needs
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center bg-gray-900/80 backdrop-blur-sm border border-gray-700 rounded-full p-1 shadow-md">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-6 py-2 rounded-full font-medium transition-all duration-200 ${
                billingCycle === "monthly"
                  ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md"
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle("yearly")}
              className={`px-6 py-2 rounded-full font-medium transition-all duration-200 ${
                billingCycle === "yearly"
                  ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md"
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              Yearly
              <span className="ml-2 text-xs bg-green-900/50 text-green-300 px-2 py-0.5 rounded-full border border-green-700">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {plans.map((plan) => {
            const Icon = plan.icon;
            const price = billingCycle === "monthly" ? plan.monthlyPrice : plan.yearlyPrice;
            const savingsAmount = plan.monthlyPrice * 12 - plan.yearlyPrice;
            
            return (
              <div
                key={plan.id}
                className={`relative rounded-2xl p-6 shadow-xl border-2 ${plan.borderColor} ${plan.bgColor} backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
                  plan.popular ? "ring-4 ring-purple-600/30" : ""
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-1 rounded-full text-xs font-semibold shadow-lg">
                      Most Popular
                    </div>
                  </div>
                )}

                <div className={`w-12 h-12 bg-gradient-to-br ${plan.color} rounded-xl flex items-center justify-center mb-4 shadow-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>

                <h3 className="text-2xl font-bold text-white mb-1">{plan.name}</h3>
                <p className="text-gray-400 text-sm mb-4">{plan.description}</p>

                <div className="mb-4">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-white">${price}</span>
                    {price > 0 && (
                      <span className="text-gray-400 text-sm">
                        /{billingCycle === "monthly" ? "mo" : "yr"}
                      </span>
                    )}
                  </div>
                  {billingCycle === "yearly" && savingsAmount > 0 && (
                    <p className="text-xs text-green-400 font-medium mt-1">
                      Save ${savingsAmount}/year
                    </p>
                  )}
                </div>

                <div className="bg-gray-900/60 rounded-lg p-3 mb-4 border border-gray-800">
                  <p className="text-xs text-gray-400 mb-1">Rate Limit</p>
                  <p className="text-sm font-semibold text-white">{plan.rateLimit}</p>
                </div>

                <button
                  onClick={() => handleSelectPlan(plan)}
                  className={`w-full py-2.5 px-4 rounded-xl font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 mb-6 ${
                    plan.popular
                      ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg hover:shadow-xl hover:scale-105"
                      : "bg-gray-800 border-2 border-gray-700 text-gray-300 hover:bg-gray-700 hover:border-gray-600"
                  }`}
                >
                  {plan.cta}
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-2">
                      {feature.included ? (
                        <div className="w-5 h-5 rounded-full bg-green-900/30 flex items-center justify-center flex-shrink-0 mt-0.5 border border-green-700">
                          <Check className="w-3 h-3 text-green-400" />
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full bg-gray-900 flex items-center justify-center flex-shrink-0 mt-0.5 border border-gray-800">
                          <X className="w-3 h-3 text-gray-600" />
                        </div>
                      )}
                      <span className={`text-xs ${feature.included ? "text-gray-300" : "text-gray-600"}`}>
                        {feature.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Payment Modal */}
        {showPayment && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-gray-700 rounded-2xl p-8 max-w-md w-full shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Complete Payment</h2>
                <button
                  onClick={() => setShowPayment(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="bg-gradient-to-br from-purple-600/20 to-blue-600/20 border border-purple-500/30 rounded-xl p-4 mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-300 font-medium">{selectedPlan?.name} Plan</span>
                  <span className="text-white font-bold text-xl">
                    ${billingCycle === "monthly" ? selectedPlan?.monthlyPrice : selectedPlan?.yearlyPrice}
                  </span>
                </div>
                <p className="text-gray-400 text-sm">
                  Billed {billingCycle} • {selectedPlan?.rateLimit}
                </p>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="text-sm text-gray-300 mb-2 block">Card Number</label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                      maxLength={19}
                      className="w-full bg-gray-900 border border-gray-700 rounded-lg px-10 py-3 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-300 mb-2 block">Expiry Date</label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                      maxLength={5}
                      className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-300 mb-2 block">CVC</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input
                        type="text"
                        placeholder="123"
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, "").slice(0, 3))}
                        maxLength={3}
                        className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={handlePayment}
                disabled={processing}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {processing ? "Processing..." : `Pay $${billingCycle === "monthly" ? selectedPlan?.monthlyPrice : selectedPlan?.yearlyPrice}`}
              </button>

              <p className="text-center text-xs text-gray-500 mt-4">
                🔒 Secure payment powered by Stripe • Your data is encrypted
              </p>
            </div>
          </div>
        )}

        {/* FAQ Section */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-2xl p-8 shadow-xl border border-gray-800">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Frequently Asked Questions</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-200 text-lg">How does rate limiting work?</h3>
              <p className="text-gray-400">Each plan has a specific number of requests allowed per 10-second window. Exceeding this limit returns a 429 error.</p>
            </div>
            
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-200 text-lg">Can I upgrade my plan?</h3>
              <p className="text-gray-400">Yes! Upgrade anytime and the new rate limits apply immediately. You'll be charged the prorated difference.</p>
            </div>
            
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-200 text-lg">What happens if I exceed my limit?</h3>
              <p className="text-gray-400">Your requests will be throttled with a 429 status code. Consider upgrading to a higher tier for more capacity.</p>
            </div>
            
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-200 text-lg">Is there a free trial?</h3>
              <p className="text-gray-400">The Bronze plan is free forever. Paid plans offer 14-day free trials with full features.</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}