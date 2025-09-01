import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { UserPlus, Users, Mail, Award } from "lucide-react";

const Header = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location.pathname);

  const navigationItems = [
    { name: "Event", path: "/events" },
    { name: "Shop", path: "/shop" },
    { name: "Community", path: "/community" },
    { name: "Media", path: "/media" }
  ];

  return (
    <header className="relative">
      {/* Hero Section with Athletic Track Background */}
      <div className="relative h-80 bg-gradient-to-r from-red-600 via-red-500 to-orange-500 overflow-hidden">
        {/* Track Lines Overlay */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><defs><pattern id="track" x="0" y="0" width="100" height="20" patternUnits="userSpaceOnUse"><rect width="100" height="2" fill="white" opacity="0.3"/></pattern></defs><rect width="100%" height="100%" fill="url(%23track)"/></svg>')] bg-repeat"></div>
        </div>
        
        {/* Logo and Title */}
        <div className="relative z-10 pt-8 pl-8">
          <div className="flex items-center mb-4">
            <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center mr-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">AT</span>
              </div>
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white mb-1">Athletics - Northern Territory</h1>
              <p className="text-white text-lg opacity-90">Training Mon - Wed - Fri evenings from 4pm - 6pm</p>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-3 mb-6">
            <Button variant="secondary" size="sm" className="bg-white/90 hover:bg-white text-red-600 font-medium">
              <UserPlus className="w-4 h-4 mr-2" />
              Subscribe
            </Button>
            <Button variant="secondary" size="sm" className="bg-white/90 hover:bg-white text-red-600 font-medium">
              <Users className="w-4 h-4 mr-2" />
              Follow
            </Button>
            <Button variant="secondary" size="sm" className="bg-white/90 hover:bg-white text-red-600 font-medium">
              <Mail className="w-4 h-4 mr-2" />
              Contact Us
            </Button>
            <Button variant="secondary" size="sm" className="bg-white/90 hover:bg-white text-red-600 font-medium">
              <Award className="w-4 h-4 mr-2" />
              Sponsor
            </Button>
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="absolute bottom-0 left-0 right-0 bg-black/20 backdrop-blur-sm">
          <div className="flex">
            <Link 
              to="/" 
              className={`px-8 py-4 text-white font-medium transition-all ${
                location.pathname === "/" ? "bg-white/20 border-b-2 border-white" : "hover:bg-white/10"
              }`}
            >
              Home
            </Link>
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`px-8 py-4 text-white font-medium transition-all ${
                  location.pathname === item.path ? "bg-white/20 border-b-2 border-white" : "hover:bg-white/10"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;