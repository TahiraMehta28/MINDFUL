
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, User, LogOut, Settings, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';
import { useLocation } from '@/contexts/LocationContext';

const Navbar = () => {
  const { user, profile, logout } = useAuth();
  const { isTracking } = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-sage-600 text-white shadow-sage">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center space-x-2 hover:text-sage-200 transition-colors">
            <Shield className="h-8 w-8" />
            <span className="text-2xl font-bold">SafeSphere</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link 
              to="/dashboard" 
              className="hover:text-sage-200 transition-colors flex items-center space-x-1"
            >
              <span>Dashboard</span>
              {isTracking && (
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              )}
            </Link>
            
            <Link 
              to="/emergency" 
              className="hover:text-sage-200 transition-colors flex items-center space-x-1 text-sage-200"
            >
              <AlertTriangle className="h-4 w-4" />
              <span>Emergency</span>
            </Link>
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {/* Tracking Status */}
            <div className="hidden sm:flex items-center space-x-2 px-3 py-1 bg-sage-700 rounded-full">
              <div className={`w-2 h-2 rounded-full ${isTracking ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`}></div>
              <span className="text-xs">{isTracking ? 'Tracking' : 'Paused'}</span>
            </div>

            {/* User Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="text-white hover:bg-sage-700">
                  <User className="h-4 w-4 mr-2" />
                  {profile?.full_name.split(' ')[0] || user?.email?.split('@')[0]}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-white">
                <div className="px-3 py-2">
                  <p className="text-sm font-medium text-sage-800">{profile?.full_name || user?.email}</p>
                  <p className="text-xs text-sage-600">{user?.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/dashboard" className="flex items-center">
                    <Shield className="h-4 w-4 mr-2" />
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="flex items-center text-red-600">
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
