"use client";

import { useEffect, useState } from "react";
import { Crown, Zap, TrendingUp, Calendar, CreditCard, AlertCircle, CheckCircle } from "lucide-react";
import Link from "next/link";

interface Subscription {
  id: string;
  tier: string;
  billingCycle: string;
  amount: number;
  status: string;
  rateLimit: number;
  currentPeriodStart: string;
  currentPeriodEnd: string;
}

export default function SubscriptionDashboard() {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    fetchSubscription();
  }, []);

  const fetchSubscription = async () => {
    try {
      const res = await fetch("/api/subscription");
      if (res.ok) {
        const data = await res.json();
        setSubscription(data);
      }
    } catch (error) {
      console.error("Failed to fetch subscription:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!subscription?.id) return;
    
    if (!confirm("Are you sure you want to cancel your subscription? You'll lose access to premium features at the end of your billing period.")) {
      return;
    }

    setCancelling(true);
    try {
      const res = await fetch(`/api/subscription?subscriptionId=${subscription.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        alert("Subscription cancelled successfully");
        fetchSubscription();
      } else {
        alert("Failed to cancel subscription");
      }
    } catch (error) {
      alert("Error cancelling subscription");
    } finally {
      setCancelling(false);
    }
  };

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case "silver":
        return Zap;
      case "gold":
        return TrendingUp;
      case "platinum":
        return Crown;
      default:
        return CheckCircle;
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "silver":
        return "from-gray-400 to-gray-600";
      case "gold":
        return "from-yellow-500 to-yellow-700";
      case "platinum":
        return "from-purple-400 to-purple-600";
      default:
        return "from-amber-700 to-amber-900";
    }
  };

  const getTierBorder = (tier: string) => {
    switch (tier) {
      case "silver":
        return "border-gray-500";
      case "gold":
        return "border-yellow-600";
      case "platinum":
        return "border-purple-500";
      default:
        return "border-amber-700";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const daysRemaining = subscription?.currentPeriodEnd
    ? Math.ceil(
        (new Date(subscription.currentPeriodEnd).getTime() - new Date().getTime()) /
          (1000 * 60 * 60 * 24)
      )
    : 0;

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading subscription...</div>
      </main>
    );
  }

  const TierIcon = subscription ? getTierIcon(subscription.tier) : CheckCircle;

  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-gray-900">
      <div className="h-16"></div>
      
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Subscription Dashboard</h1>
          <p className="text-gray-400">Manage your API access and billing</p>
        </div>

        {/* Current Plan Card */}
        <div className={`bg-gradient-to-br ${subscription ? getTierColor(subscription.tier) : 'from-gray-800 to-gray-900'}/20 border-2 ${subscription ? getTierBorder(subscription.tier) : 'border-gray-700'} rounded-2xl p-8 mb-8 backdrop-blur-sm`}>
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className={`w-16 h-16 bg-gradient-to-br ${subscription ? getTierColor(subscription.tier) : 'from-gray-700 to-gray-800'} rounded-xl flex items-center justify-center shadow-lg`}>
                <TierIcon className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white capitalize">
                  {subscription?.tier || "Bronze"} Plan
                </h2>
                <p className="text-gray-400">
                  {subscription?.status === "active" ? "Active Subscription" : "Free Plan"}
                </p>
              </div>
            </div>
            
            {subscription?.status === "active" && (
              <div className="bg-green-900/30 border border-green-700 px-4 py-2 rounded-full">
                <span className="text-green-400 font-semibold">Active</span>
              </div>
            )}
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gray-900/60 rounded-xl p-4 border border-gray-800">
              <div className="flex items-center gap-2 text-gray-400 mb-2">
                <Zap className="w-4 h-4" />
                <span className="text-sm">Rate Limit</span>
              </div>
              <p className="text-2xl font-bold text-white">
                {subscription?.rateLimit.toLocaleString() || "100"}
                <span className="text-sm text-gray-400 ml-1">/ 10s</span>
              </p>
            </div>

            <div className="bg-gray-900/60 rounded-xl p-4 border border-gray-800">
              <div className="flex items-center gap-2 text-gray-400 mb-2">
                <CreditCard className="w-4 h-4" />
                <span className="text-sm">Billing</span>
              </div>
              <p className="text-2xl font-bold text-white">
                ${subscription?.amount || 0}
                <span className="text-sm text-gray-400 ml-1">
                  /{subscription?.billingCycle === "yearly" ? "year" : "month"}
                </span>
              </p>
            </div>

            <div className="bg-gray-900/60 rounded-xl p-4 border border-gray-800">
              <div className="flex items-center gap-2 text-gray-400 mb-2">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">Next Billing</span>
              </div>
              <p className="text-xl font-bold text-white">
                {subscription?.currentPeriodEnd ? (
                  <span>
                    {daysRemaining} days
                    <span className="text-sm text-gray-400 block">
                      {formatDate(subscription.currentPeriodEnd)}
                    </span>
                  </span>
                ) : (
                  <span className="text-gray-500">N/A</span>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Usage Stats */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-800 rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">Usage This Period</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-400">API Requests</span>
                  <span className="text-white font-semibold">~45,231</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2">
                  <div
                    className={`bg-gradient-to-r ${subscription ? getTierColor(subscription.tier) : 'from-gray-600 to-gray-700'} h-2 rounded-full`}
                    style={{ width: "65%" }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-400">Rate Limit Usage</span>
                  <span className="text-white font-semibold">35%</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-green-600 to-green-700 h-2 rounded-full"
                    style={{ width: "35%" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-800 rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link href="/pricing">
                <button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-xl font-semibold hover:scale-105 transition-transform">
                  Upgrade Plan
                </button>
              </Link>
              
              {subscription?.status === "active" && subscription.tier !== "bronze" && (
                <button
                  onClick={handleCancelSubscription}
                  disabled={cancelling}
                  className="w-full bg-gray-800 border-2 border-gray-700 text-gray-300 py-3 rounded-xl font-semibold hover:bg-gray-700 transition-colors disabled:opacity-50"
                >
                  {cancelling ? "Cancelling..." : "Cancel Subscription"}
                </button>
              )}

              <Link href="/keys">
                <button className="w-full bg-gray-800 border-2 border-gray-700 text-gray-300 py-3 rounded-xl font-semibold hover:bg-gray-700 transition-colors">
                  Manage API Keys
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Info Banner */}
        <div className="bg-blue-900/20 border border-blue-700 rounded-xl p-6 flex items-start gap-4">
          <AlertCircle className="w-6 h-6 text-blue-400 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-lg font-semibold text-white mb-2">How Rate Limits Work</h4>
            <p className="text-gray-300 text-sm leading-relaxed">
              Your rate limit determines how many API requests you can make within a 10-second window. 
              If you exceed this limit, you'll receive a 429 error until the window resets. 
              Upgrade your plan for higher limits and better performance.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}