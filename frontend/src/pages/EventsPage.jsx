import React, { useState } from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { Calendar, Users, Trophy, MapPin, Clock, DollarSign, ChevronRight } from "lucide-react";
import { mockData } from "../utils/mock";
import { useToast } from "../hooks/use-toast";

const EventsPage = () => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const { toast } = useToast();

  const handleEventRegistration = (event) => {
    toast({
      title: "Registration Successful!",
      description: `You've been registered for ${event.name}. Check your email for confirmation.`,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Athletics Events
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join our exciting athletics events and competitions. From training sessions to championships, there's something for every athlete.
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-red-500 to-orange-500 mx-auto mt-6"></div>
        </div>

        {/* Events Tabs */}
        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2 mb-8 mx-auto">
            <TabsTrigger value="upcoming" className="text-lg">UPCOMING EVENTS</TabsTrigger>
            <TabsTrigger value="previous" className="text-lg">PREVIOUS EVENTS</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-8">
            <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-8">
              {mockData.events.upcoming.map((event) => (
                <Card key={event.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <div className="h-48 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 relative">
                    <div className="absolute inset-0 bg-black/30"></div>
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-white/90 text-purple-600 font-medium">
                        {event.type}
                      </Badge>
                      {event.memberOnly && (
                        <Badge className="bg-red-500 text-white ml-2">
                          Members Only
                        </Badge>
                      )}
                    </div>
                    <div className="absolute bottom-4 left-4 text-white">
                      <h3 className="font-bold text-xl mb-1">{event.name}</h3>
                      <p className="text-white/90 flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        {event.date}
                      </p>
                      <p className="text-white/90 flex items-center mt-1">
                        <Clock className="w-4 h-4 mr-2" />
                        {event.time}
                      </p>
                    </div>
                  </div>
                  
                  <CardContent className="p-6">
                    <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center text-gray-500">
                          <MapPin className="w-4 h-4 mr-1" />
                          {event.location}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center text-gray-500">
                          <Users className="w-4 h-4 mr-1" />
                          {event.registrations}/{event.maxCapacity} registered
                        </span>
                        <span className="flex items-center text-gray-500">
                          <DollarSign className="w-4 h-4 mr-1" />
                          {event.price === 0 ? 'Free' : `$${event.price}`}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" className="flex-1">
                            View Details
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle className="text-2xl">{event.name}</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="grid md:grid-cols-2 gap-4">
                              <div>
                                <h4 className="font-semibold mb-2">Event Details</h4>
                                <div className="space-y-2 text-sm">
                                  <p><Calendar className="w-4 h-4 inline mr-2" />{event.date}</p>
                                  <p><Clock className="w-4 h-4 inline mr-2" />{event.time}</p>
                                  <p><MapPin className="w-4 h-4 inline mr-2" />{event.location}</p>
                                  <p><DollarSign className="w-4 h-4 inline mr-2" />{event.price === 0 ? 'Free' : `$${event.price}`}</p>
                                </div>
                              </div>
                              <div>
                                <h4 className="font-semibold mb-2">Registration Info</h4>
                                <div className="space-y-2 text-sm">
                                  <p><Users className="w-4 h-4 inline mr-2" />{event.registrations}/{event.maxCapacity} spots filled</p>
                                  <p>Deadline: {event.registrationDeadline}</p>
                                  {event.memberOnly && <p className="text-red-600">⚠️ Members only event</p>}
                                </div>
                              </div>
                            </div>
                            <div>
                              <h4 className="font-semibold mb-2">Description</h4>
                              <p className="text-gray-600">{event.description}</p>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                      
                      <Button 
                        onClick={() => handleEventRegistration(event)}
                        className="bg-red-500 hover:bg-red-600 text-white flex-1"
                        disabled={event.registrations >= event.maxCapacity}
                      >
                        {event.registrations >= event.maxCapacity ? 'Full' : 'Register'}
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="previous" className="space-y-8">
            <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-8">
              {mockData.events.previous.map((event) => (
                <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="h-48 bg-gradient-to-br from-gray-500 to-gray-600 relative">
                    <div className="absolute inset-0 bg-black/20"></div>
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-white/90 text-gray-600 font-medium">
                        {event.type}
                      </Badge>
                      <Badge className="bg-green-500 text-white ml-2">
                        Completed
                      </Badge>
                    </div>
                    <div className="absolute bottom-4 left-4 text-white">
                      <h3 className="font-bold text-xl mb-1">{event.name}</h3>
                      <p className="text-white/90 flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        {event.date}
                      </p>
                    </div>
                  </div>
                  
                  <CardContent className="p-6">
                    <p className="text-gray-600 mb-4">{event.description}</p>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center text-gray-500">
                          <Users className="w-4 h-4 mr-1" />
                          {event.participants} participated
                        </span>
                        {event.winner && (
                          <span className="flex items-center text-gray-500">
                            <Trophy className="w-4 h-4 mr-1" />
                            Winner: {event.winner}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <Button variant="outline" className="w-full">
                      View Results
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default EventsPage;