import React, { useState } from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { CheckCircle, Star, QrCode, Download } from "lucide-react";
import { mockData } from "../utils/mock";
import { useToast } from "../hooks/use-toast";

const MembershipPage = () => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const { toast } = useToast();

  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan);
    toast({
      title: "Plan Selected",
      description: `You've selected the ${plan.name} plan. Proceeding to registration...`,
    });
  };

  const handleDownloadCard = () => {
    toast({
      title: "Card Downloaded",
      description: "Your digital membership card has been downloaded to your device.",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Choose Your Membership
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join Athletics Northern Territory and unlock your athletic potential with our comprehensive membership plans
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-red-500 to-orange-500 mx-auto mt-6"></div>
        </div>

        {/* Current Membership Display */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Your Current Membership</h2>
          <div className="max-w-md mx-auto">
            <Card className="bg-gradient-to-br from-red-500 to-orange-600 text-white border-0 shadow-2xl">
              <CardContent className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-bold">{mockData.user.membershipType} Member</h3>
                    <p className="text-white/80">ID: {mockData.user.memberId}</p>
                  </div>
                  <div className="w-16 h-16 bg-white/20 rounded-lg flex items-center justify-center">
                    <QrCode className="w-8 h-8 text-white" />
                  </div>
                </div>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-white/80">Member:</span>
                    <span className="font-medium">{mockData.user.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/80">Valid Until:</span>
                    <span>Dec 2025</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/80">Status:</span>
                    <Badge className="bg-green-500 text-white">Active</Badge>
                  </div>
                </div>
                
                <Button
                  onClick={handleDownloadCard}
                  className="w-full bg-white/20 hover:bg-white/30 text-white border-white/30"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Digital Card
                </Button>
                
                <div className="mt-6 pt-6 border-t border-white/20 text-center">
                  <img 
                    src={mockData.qrCodes.memberCard} 
                    alt="Member QR Code" 
                    className="w-24 h-24 mx-auto bg-white rounded-lg p-2"
                  />
                  <p className="text-xs text-white/80 mt-2">Scan for quick access</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Membership Plans */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Upgrade or Renew</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {mockData.membership.plans.map((plan) => (
              <Card 
                key={plan.id} 
                className={`relative overflow-hidden transition-all duration-300 hover:shadow-xl ${
                  plan.popular ? 'ring-2 ring-red-500 scale-105' : 'hover:scale-102'
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-0 bg-red-500 text-white px-4 py-1 text-sm font-bold">
                    <Star className="w-4 h-4 inline mr-1" />
                    POPULAR
                  </div>
                )}
                
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-2xl font-bold text-gray-900">
                    {plan.name}
                  </CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-red-500">${plan.price}</span>
                    <span className="text-gray-600 ml-2">/{plan.duration}</span>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button
                    onClick={() => handlePlanSelect(plan)}
                    className={`w-full ${
                      plan.popular
                        ? 'bg-red-500 hover:bg-red-600 text-white'
                        : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
                    }`}
                  >
                    {plan.id === 'premium' ? 'Current Plan' : 'Select Plan'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Benefits Section */}
        <div className="text-center bg-white rounded-xl p-12 shadow-lg">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Why Join Athletics Northern Territory?
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-red-500 mb-2">{mockData.stats.totalMembers}</div>
              <p className="text-gray-600">Active Members</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-red-500 mb-2">{mockData.stats.completedEvents}</div>
              <p className="text-gray-600">Events Completed</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-red-500 mb-2">{mockData.stats.trainingHours.toLocaleString()}</div>
              <p className="text-gray-600">Training Hours</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-red-500 mb-2">{mockData.stats.activeEvents}</div>
              <p className="text-gray-600">Active Events</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MembershipPage;