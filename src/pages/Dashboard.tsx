
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLocation } from '@/contexts/LocationContext';
import Navbar from '@/components/Navbar';
import LocationMap from '@/components/LocationMap';
import EmergencyButton from '@/components/EmergencyButton';
import SafetyStats from '@/components/SafetyStats';
import NearbyHelp from '@/components/NearbyHelp';
import EmergencyContacts from '@/components/EmergencyContacts';
import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, Clock, MapPin } from 'lucide-react';

const Dashboard = () => {
  const { isAuthenticated, loading, user } = useAuth();
  const { isTracking, startTracking, stopTracking, currentLocation, todayActiveMinutes } = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sage-200 via-sage-100 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sage-600 mx-auto mb-4"></div>
          <p className="text-sage-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const formatActiveTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-200 via-sage-100 to-white">
      <Navbar />
      
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-sage-800 mb-2">
            Welcome back, {user?.user_metadata?.full_name || user?.email?.split('@')[0]}
          </h1>
          <p className="text-sage-600">Stay safe and connected with your personal safety companion.</p>
        </div>

        {/* Tracking Control */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-sage-600" />
                Location Tracking
              </span>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-sm text-sage-600">
                  <Clock className="h-4 w-4" />
                  <span>Today: {formatActiveTime(todayActiveMinutes)}</span>
                </div>
                <Button
                  onClick={isTracking ? stopTracking : startTracking}
                  className={`${
                    isTracking 
                      ? 'bg-red-600 hover:bg-red-700' 
                      : 'bg-sage-600 hover:bg-sage-700'
                  }`}
                >
                  {isTracking ? (
                    <>
                      <Pause className="h-4 w-4 mr-2" />
                      Pause Tracking
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Start Tracking
                    </>
                  )}
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <div className={`w-3 h-3 rounded-full ${isTracking ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
              <span className="text-sm text-sage-600">
                {isTracking ? 'Actively tracking your location' : 'Location tracking is paused'}
              </span>
              {currentLocation && (
                <span className="text-xs text-sage-500">
                  Last updated: {currentLocation.timestamp.toLocaleTimeString()}
                </span>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Emergency Button */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sage-800">Emergency Alert</CardTitle>
              </CardHeader>
              <CardContent>
                <EmergencyButton size="large" />
              </CardContent>
            </Card>

            {/* Map */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sage-800">Your Location</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <LocationMap />
              </CardContent>
            </Card>

            {/* Safety Stats */}
            <SafetyStats />
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Emergency Contacts */}
            <EmergencyContacts />

            {/* Nearby Help */}
            <NearbyHelp />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
