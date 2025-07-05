
import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from '@/contexts/LocationContext';
import { Button } from '@/components/ui/button';
import { MapPin, Navigation, Layers } from 'lucide-react';

declare global {
  interface Window {
    google: any;
    initMap: () => void;
  }
}

const LocationMap = () => {
  const { currentLocation, locationHistory, isTracking } = useLocation();
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [mapType, setMapType] = useState<'roadmap' | 'satellite'>('roadmap');
  const markersRef = useRef<any[]>([]);
  const pathRef = useRef<any>(null);

  // Load Google Maps script
  useEffect(() => {
    if (!window.google) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dO7iq7vO0hqLs6&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        setIsLoaded(true);
      };
      document.head.appendChild(script);
    } else {
      setIsLoaded(true);
    }
  }, []);

  // Initialize map
  useEffect(() => {
    if (isLoaded && mapRef.current && !map) {
      const defaultCenter = currentLocation || { lat: 28.6139, lng: 77.2090 }; // Delhi, India
      
      const newMap = new window.google.maps.Map(mapRef.current, {
        zoom: 15,
        center: defaultCenter,
        mapTypeId: mapType,
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'on' }]
          }
        ]
      });

      setMap(newMap);
    }
  }, [isLoaded, currentLocation, mapType]);

  // Update map with current location and path
  useEffect(() => {
    if (!map || !currentLocation) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    // Clear existing path
    if (pathRef.current) {
      pathRef.current.setMap(null);
    }

    // Add current location marker
    const currentMarker = new window.google.maps.Marker({
      position: currentLocation,
      map: map,
      title: 'Current Location',
      icon: {
        url: 'data:image/svg+xml;base64,' + btoa(`
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="8" fill="#537D5D" stroke="white" stroke-width="2"/>
            <circle cx="12" cy="12" r="3" fill="white"/>
          </svg>
        `),
        scaledSize: new window.google.maps.Size(24, 24),
        anchor: new window.google.maps.Point(12, 12)
      }
    });

    markersRef.current.push(currentMarker);

    // Center map on current location
    map.setCenter(currentLocation);

    // Draw path if tracking and have history
    if (isTracking && locationHistory.length > 1) {
      const path = locationHistory.map(loc => ({ lat: loc.lat, lng: loc.lng }));
      
      pathRef.current = new window.google.maps.Polyline({
        path: path,
        geodesic: true,
        strokeColor: '#537D5D',
        strokeOpacity: 0.8,
        strokeWeight: 3,
        map: map
      });
    }

    // Add info window
    const infoWindow = new window.google.maps.InfoWindow({
      content: `
        <div style="padding: 8px;">
          <h3 style="margin: 0 0 8px 0; color: #537D5D;">Current Location</h3>
          <p style="margin: 0; font-size: 12px; color: #666;">
            Lat: ${currentLocation.lat.toFixed(6)}<br/>
            Lng: ${currentLocation.lng.toFixed(6)}<br/>
            Time: ${currentLocation.timestamp.toLocaleTimeString()}
          </p>
        </div>
      `
    });

    currentMarker.addListener('click', () => {
      infoWindow.open(map, currentMarker);
    });

  }, [map, currentLocation, locationHistory, isTracking]);

  const centerOnLocation = () => {
    if (map && currentLocation) {
      map.setCenter(currentLocation);
      map.setZoom(18);
    }
  };

  const toggleMapType = () => {
    const newMapType = mapType === 'roadmap' ? 'satellite' : 'roadmap';
    setMapType(newMapType);
    if (map) {
      map.setMapTypeId(newMapType);
    }
  };

  if (!isLoaded) {
    return (
      <div className="h-96 bg-sage-50 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sage-600 mx-auto mb-4"></div>
          <p className="text-sage-600">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div ref={mapRef} className="h-96 w-full rounded-lg" />
      
      {/* Map Controls */}
      <div className="absolute top-4 right-4 flex flex-col space-y-2">
        <Button
          size="sm"
          onClick={centerOnLocation}
          className="bg-white hover:bg-sage-50 text-sage-700 border border-sage-200 shadow-sm"
        >
          <Navigation className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          onClick={toggleMapType}
          className="bg-white hover:bg-sage-50 text-sage-700 border border-sage-200 shadow-sm"
        >
          <Layers className="h-4 w-4" />
        </Button>
      </div>

      {/* Location Info */}
      <div className="absolute bottom-4 left-4 bg-white bg-opacity-90 backdrop-blur-sm rounded-lg p-3 shadow-sm">
        <div className="flex items-center space-x-2 text-sm">
          <MapPin className="h-4 w-4 text-sage-600" />
          <div>
            {currentLocation ? (
              <>
                <div className="font-medium text-sage-800">
                  {currentLocation.lat.toFixed(4)}, {currentLocation.lng.toFixed(4)}
                </div>
                <div className="text-xs text-sage-600">
                  Updated: {currentLocation.timestamp.toLocaleTimeString()}
                </div>
              </>
            ) : (
              <div className="text-sage-600">Getting your location...</div>
            )}
          </div>
        </div>
        {isTracking && (
          <div className="mt-2 flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-green-600 font-medium">Live Tracking Active</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default LocationMap;
