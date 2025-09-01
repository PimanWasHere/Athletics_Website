import React, { useState } from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { QrCode, Scan, Calendar, Users, Trophy, ChevronRight } from "lucide-react";
import { mockData } from "../utils/mock";

const HomePage = () => {
  const [selectedCard, setSelectedCard] = useState(null);
  const [showQRScanner, setShowQRScanner] = useState(false);

  const handleCardSelect = (card) => {
    setSelectedCard(card);
  };

  const handleQRScan = () => {
    setShowQRScanner(true);
    // Mock QR scan result
    setTimeout(() => {
      setShowQRScanner(false);
      alert("Access granted! Welcome to Athletics NT");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Featured Section */}
      <section className="py-16 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              FEATURED: Sports Membership Reward Card
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-red-500 to-orange-500 mx-auto"></div>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Membership Card Display */}
            <div className="space-y-6">
              <div className="relative">
                <Card className="bg-gradient-to-br from-red-500 to-orange-600 text-white border-0 shadow-2xl transform rotate-2 hover:rotate-0 transition-transform duration-300">
                  <CardContent className="p-8">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                          <Trophy className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold">Members Card</h3>
                          <p className="text-white/80">Premium Access</p>
                        </div>
                      </div>
                      <div className="w-16 h-16 bg-white/90 rounded-lg flex items-center justify-center">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold">AT</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-white/80">Member ID:</span>
                        <span className="font-mono">NT-{mockData.user.memberId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/80">Name:</span>
                        <span className="font-medium">{mockData.user.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/80">Valid Until:</span>
                        <span>Dec 2025</span>
                      </div>
                    </div>
                    
                    <div className="mt-6 pt-6 border-t border-white/20">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-white/80">Athletics Northern Territory</span>
                        <QrCode className="w-8 h-8 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Floating Card Variations */}
                <Card className="absolute -top-4 -right-4 bg-white border shadow-lg transform -rotate-3 w-32 h-20 opacity-80">
                  <CardContent className="p-3 flex items-center justify-center">
                    <span className="text-xs font-medium text-gray-600">Rewards Card</span>
                  </CardContent>
                </Card>
              </div>
            </div>
            
            {/* Decentralise Access Section */}
            <div className="space-y-6">
              <Card className="bg-gradient-to-br from-pink-500 to-red-500 text-white border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center">
                    <Scan className="w-8 h-8 mr-3" />
                    Decentralise Access
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-white/10 rounded-lg p-4">
                    <p className="text-center font-medium mb-4">SCAN EASY ACCESS CARD BELOW</p>
                    
                    {showQRScanner ? (
                      <div className="bg-black/20 rounded-lg p-8 text-center">
                        <div className="animate-pulse">
                          <Scan className="w-16 h-16 mx-auto mb-4" />
                          <p>Scanning QR Code...</p>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-white/90 rounded-lg p-6 text-center">
                        <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                          <QrCode className="w-10 h-10 text-white" />
                        </div>
                        <p className="text-gray-600 mb-4">QR Scanner for easy login</p>
                        <Button 
                          onClick={handleQRScan}
                          className="bg-red-500 hover:bg-red-600 text-white"
                        >
                          <Scan className="w-4 h-4 mr-2" />
                          Scan Now
                        </Button>
                      </div>
                    )}
                  </div>
                  
                  <div className="bg-white/10 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-medium">Scan</span>
                      <QrCode className="w-6 h-6" />
                    </div>
                    <p className="text-sm opacity-90">For Easy Login and Account recover</p>
                    <p className="text-xs opacity-75 mt-1">Scan card to access your Online Wallet</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
      
      {/* Events Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-8">Our Events</h3>
          
          <Tabs defaultValue="upcoming" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-2 mb-8">
              <TabsTrigger value="previous">PREVIOUS</TabsTrigger>
              <TabsTrigger value="upcoming">UPCOMING</TabsTrigger>
            </TabsList>
            
            <TabsContent value="previous" className="space-y-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockData.events.previous.map((event) => (
                  <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="h-48 bg-gradient-to-br from-red-400 to-orange-500 relative">
                      <div className="absolute inset-0 bg-black/20"></div>
                      <div className="absolute bottom-4 left-4 text-white">
                        <Badge className="bg-white/20 text-white mb-2">{event.type}</Badge>
                        <h4 className="font-bold text-lg">{event.name}</h4>
                        <p className="text-sm opacity-90">{event.date}</p>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <p className="text-gray-600 text-sm">{event.description}</p>
                      <div className="flex items-center justify-between mt-4">
                        <span className="text-sm text-gray-500">
                          <Users className="w-4 h-4 inline mr-1" />
                          {event.participants} attended
                        </span>
                        <Button variant="outline" size="sm">
                          View Results
                          <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="upcoming" className="space-y-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockData.events.upcoming.map((event) => (
                  <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="h-48 bg-gradient-to-br from-blue-400 to-purple-500 relative">
                      <div className="absolute inset-0 bg-black/20"></div>
                      <div className="absolute bottom-4 left-4 text-white">
                        <Badge className="bg-white/20 text-white mb-2">{event.type}</Badge>
                        <h4 className="font-bold text-lg">{event.name}</h4>
                        <p className="text-sm opacity-90">{event.date}</p>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <p className="text-gray-600 text-sm">{event.description}</p>
                      <div className="flex items-center justify-between mt-4">
                        <span className="text-sm text-gray-500">
                          <Calendar className="w-4 h-4 inline mr-1" />
                          {event.registrations} registered
                        </span>
                        <Button className="bg-red-500 hover:bg-red-600 text-white" size="sm">
                          Register Now
                          <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
};

export default HomePage;