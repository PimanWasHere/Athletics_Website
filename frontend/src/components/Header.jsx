import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { UserPlus, Users, Mail, Award, LogOut, User, Settings } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import LoginModal from "./LoginModal";
import { useToast } from "../hooks/use-toast";

const Header = () => {
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { toast } = useToast();

  const navigationItems = [
    { name: "Event", path: "/events" },
    { name: "Shop", path: "/shop" },
    { name: "Community", path: "/community" },
    { name: "Media", path: "/media" }
  ];

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account.",
    });
  };

  const handleActionClick = (action) => {
    if (!isAuthenticated && (action === "Subscribe" || action === "Follow" || action === "Contact Us")) {
      setShowLoginModal(true);
      return;
    }
    
    toast({
      title: `${action} clicked`,
      description: `${action} functionality will be implemented soon.`,
    });
  };

  return (
    <>
      <header className="relative">
        {/* Hero Section with Athletic Track Background */}
        <div className="relative h-80 bg-gradient-to-r from-red-600 via-red-500 to-orange-500 overflow-hidden">
          {/* Track Lines Overlay */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute inset-0" style={{
              backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 98px, rgba(255,255,255,0.3) 98px, rgba(255,255,255,0.3) 100px)'
            }}></div>
          </div>
          
          {/* Logo and Title */}
          <div className="relative z-10 pt-8 pl-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
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
              
              {/* User Profile or Login */}
              <div className="pr-8">
                {isAuthenticated ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="relative h-10 w-10 rounded-full bg-white/10 hover:bg-white/20">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={user?.avatar} alt={user?.name} />
                          <AvatarFallback className="bg-white text-red-600 font-bold">
                            {user?.name?.split(' ').map(n => n[0]).join('') || 'U'}
                          </AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-64" align="end" forceMount>
                      <div className="flex items-center justify-start gap-2 p-2">
                        <div className="flex flex-col space-y-1 leading-none">
                          <p className="font-medium">{user?.name}</p>
                          <p className="w-full truncate text-sm text-muted-foreground">
                            {user?.email}
                          </p>
                          <Badge variant="outline" className="w-fit">
                            {user?.membershipType} Member
                          </Badge>
                        </div>
                      </div>
                      <DropdownMenuItem onClick={() => setShowLoginModal(false)}>
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setShowLoginModal(false)}>
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleLogout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        Log out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Button 
                    onClick={() => setShowLoginModal(true)}
                    className="bg-white/90 hover:bg-white text-red-600 font-medium"
                  >
                    Sign In
                  </Button>
                )}
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-3 mb-6">
              <Button 
                variant="secondary" 
                size="sm" 
                className="bg-white/90 hover:bg-white text-red-600 font-medium"
                onClick={() => handleActionClick("Subscribe")}
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Subscribe
              </Button>
              <Button 
                variant="secondary" 
                size="sm" 
                className="bg-white/90 hover:bg-white text-red-600 font-medium"
                onClick={() => handleActionClick("Follow")}
              >
                <Users className="w-4 h-4 mr-2" />
                Follow
              </Button>
              <Button 
                variant="secondary" 
                size="sm" 
                className="bg-white/90 hover:bg-white text-red-600 font-medium"
                onClick={() => handleActionClick("Contact Us")}
              >
                <Mail className="w-4 h-4 mr-2" />
                Contact Us
              </Button>
              <Button 
                variant="secondary" 
                size="sm" 
                className="bg-white/90 hover:bg-white text-red-600 font-medium"
                onClick={() => handleActionClick("Sponsor")}
              >
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
      
      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)} 
      />
    </>
  );
};

export default Header;