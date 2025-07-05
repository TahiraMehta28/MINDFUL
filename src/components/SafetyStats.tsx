
import React from 'react';
import { Activity, MapPin, Clock, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLocation } from '@/contexts/LocationContext';

const SafetyStats = () => {
  const { locationHistory, isTracking } = useLocation();

  // Mock data for demonstration
  const stats = {
    activeTime: '2h 15m',
    distanceTraveled: '3.2 km',
    safetyScore: 98,
    alertsToday: 0,
    weeklyTrend: '+12%'
  };

  return (
    <Card className="bg-white shadow-sage border-sage-200">
      <CardHeader>
        <CardTitle className="flex items-center text-sage-800">
          <Activity className="h-5 w-5 mr-2" />
          Safety Analytics
        </CardTitle>
        <CardDescription>
          Your safety metrics for today
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Active Time */}
          <div className="text-center p-4 bg-sage-50 rounded-lg">
            <Clock className="h-8 w-8 text-sage-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-sage-800">{stats.activeTime}</p>
            <p className="text-sm text-sage-600">Active Time</p>
          </div>

          {/* Distance */}
          <div className="text-center p-4 bg-sage-50 rounded-lg">
            <MapPin className="h-8 w-8 text-sage-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-sage-800">{stats.distanceTraveled}</p>
            <p className="text-sm text-sage-600">Distance</p>
          </div>

          {/* Safety Score */}
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="w-8 h-8 mx-auto mb-2 bg-green-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">✓</span>
            </div>
            <p className="text-2xl font-bold text-green-800">{stats.safetyScore}%</p>
            <p className="text-sm text-green-600">Safety Score</p>
          </div>

          {/* Weekly Trend */}
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <TrendingUp className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-blue-800">{stats.weeklyTrend}</p>
            <p className="text-sm text-blue-600">Weekly Trend</p>
          </div>
        </div>

        {/* Additional Stats */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white border border-sage-200 rounded-lg p-4">
            <h4 className="font-medium text-sage-800 mb-2">Today's Activity</h4>
            <div className="space-y-2 text-sm text-sage-600">
              <div className="flex justify-between">
                <span>Location points logged:</span>
                <span className="font-medium">{locationHistory.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Tracking status:</span>
                <span className={`font-medium ${isTracking ? 'text-green-600' : 'text-yellow-600'}`}>
                  {isTracking ? 'Active' : 'Paused'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Alerts triggered:</span>
                <span className="font-medium text-green-600">{stats.alertsToday}</span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-sage-200 rounded-lg p-4">
            <h4 className="font-medium text-sage-800 mb-2">Safety Features</h4>
            <div className="space-y-2 text-sm text-sage-600">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Live tracking enabled</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Emergency contacts ready</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Inactivity monitoring on</span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-sage-200 rounded-lg p-4">
            <h4 className="font-medium text-sage-800 mb-2">Quick Stats</h4>
            <div className="space-y-2 text-sm text-sage-600">
              <div className="flex justify-between">
                <span>Days using SafeSphere:</span>
                <span className="font-medium">12</span>
              </div>
              <div className="flex justify-between">
                <span>Safe arrivals:</span>
                <span className="font-medium text-green-600">47</span>
              </div>
              <div className="flex justify-between">
                <span>Average daily distance:</span>
                <span className="font-medium">2.8 km</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SafetyStats;
