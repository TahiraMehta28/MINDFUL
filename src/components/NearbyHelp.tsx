
import React, { useState, useEffect } from 'react';
import { MapPin, Phone, Navigation, Clock, Shield } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLocation } from '@/contexts/LocationContext';

const NearbyHelp = () => {
  const { currentLocation, nearbyPoliceStations, safetyScore, getNearbyPoliceStations } = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (currentLocation && nearbyPoliceStations.length === 0) {
      getNearbyPoliceStations();
    }
  }, [currentLocation]);

  const refreshLocations = async () => {
    setIsLoading(true);
    await getNearbyPoliceStations();
    setIsLoading(false);
  };

  const getSafetyColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getSafetyBadge = (score: number) => {
    if (score >= 80) return 'bg-green-100 text-green-800';
    if (score >= 60) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <Card className="bg-white shadow-sage border-sage-200">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-sage-800">
          <div className="flex items-center">
            <MapPin className="h-5 w-5 mr-2" />
            Nearby Help & Safety
          </div>
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${getSafetyBadge(safetyScore)}`}>
            Safety Score: {safetyScore}%
          </div>
        </CardTitle>
        <CardDescription>
          Police stations and safety assessment for your area
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Safety Assessment */}
        <div className="mb-6 p-4 rounded-lg border border-sage-200 bg-sage-50">
          <div className="flex items-center mb-2">
            <Shield className="h-5 w-5 mr-2 text-sage-600" />
            <span className="font-medium text-sage-800">Area Safety Assessment</span>
          </div>
          <div className="text-sm text-sage-600 space-y-1">
            <p className={`font-medium ${getSafetyColor(safetyScore)}`}>
              {safetyScore >= 80 ? 'Very Safe Area' : 
               safetyScore >= 60 ? 'Moderately Safe Area' : 
               'Exercise Caution'}
            </p>
            <p>Based on proximity to {nearbyPoliceStations.length} police stations</p>
            {nearbyPoliceStations.length > 0 && (
              <p>Nearest station: {nearbyPoliceStations[0].distance.toFixed(1)} km away</p>
            )}
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-sage-100 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-sage-100 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : nearbyPoliceStations.length > 0 ? (
          <div className="space-y-3">
            {nearbyPoliceStations.map((station, index) => (
              <div key={index} className="border border-sage-200 rounded-lg p-3 hover:border-sage-300 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-medium text-sage-800 text-sm">{station.name}</h4>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3 text-green-600" />
                        <span className="text-xs text-green-600">24/7</span>
                      </div>
                    </div>
                    <p className="text-xs text-sage-600 mb-1">{station.address}</p>
                    <div className="flex items-center space-x-1">
                      <Navigation className="h-3 w-3 text-sage-500" />
                      <span className="text-xs text-sage-600">{station.distance.toFixed(1)} km away</span>
                    </div>
                  </div>
                  <div className="flex flex-col space-y-1">
                    <Button
                      asChild
                      size="sm"
                      variant="outline"
                      className="border-sage-300 text-sage-700 hover:bg-sage-50"
                    >
                      <a href={`https://maps.google.com/maps?q=${station.lat},${station.lng}`} target="_blank" rel="noopener noreferrer">
                        <MapPin className="h-3 w-3 mr-1" />
                        View
                      </a>
                    </Button>
                    {station.phone && (
                      <Button
                        asChild
                        size="sm"
                        variant="outline"
                        className="border-sage-300 text-sage-700 hover:bg-sage-50"
                      >
                        <a href={`tel:${station.phone}`}>
                          <Phone className="h-3 w-3 mr-1" />
                          Call
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            <Button
              onClick={refreshLocations}
              variant="outline"
              size="sm"
              className="w-full border-sage-300 text-sage-700 hover:bg-sage-50 mt-3"
            >
              Refresh Locations
            </Button>
          </div>
        ) : (
          <div className="text-center py-4 text-sage-600">
            <MapPin className="h-8 w-8 mx-auto mb-2 text-sage-400" />
            <p className="text-sm">Enable location to find nearby help</p>
            <Button
              onClick={refreshLocations}
              size="sm"
              className="mt-2 bg-sage-600 hover:bg-sage-700"
            >
              Find Nearby Help
            </Button>
          </div>
        )}

        {/* Emergency Quick Actions */}
        <div className="mt-4 pt-4 border-t border-sage-200">
          <p className="text-sm font-medium text-sage-800 mb-2">Emergency Services (India):</p>
          <div className="grid grid-cols-2 gap-2">
            <Button
              asChild
              size="sm"
              className="bg-emergency hover:bg-emergency-hover text-white"
            >
              <a href="tel:112">
                <Phone className="h-3 w-3 mr-1" />
                Call 112
              </a>
            </Button>
            <Button
              asChild
              size="sm"
              variant="outline"
              className="border-emergency text-emergency hover:bg-emergency hover:text-white"
            >
              <a href="tel:100">
                <Phone className="h-3 w-3 mr-1" />
                Police 100
              </a>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NearbyHelp;
