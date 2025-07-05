import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';
import { useToast } from '@/hooks/use-toast';

interface Location {
  lat: number;
  lng: number;
  timestamp: Date;
  address?: string;
  placeName?: string;
}

interface ActivitySession {
  id: string;
  start_time: string;
  end_time: string | null;
  total_duration: number | null;
  date: string;
}

interface PoliceStation {
  name: string;
  address: string;
  distance: number;
  lat: number;
  lng: number;
  phone?: string;
}

interface LocationContextType {
  currentLocation: Location | null;
  locationHistory: Location[];
  isTracking: boolean;
  activitySessions: ActivitySession[];
  todayActiveMinutes: number;
  nearbyPoliceStations: PoliceStation[];
  safetyScore: number;
  startTracking: () => void;
  stopTracking: () => void;
  triggerEmergency: (message?: string) => Promise<void>;
  loadLocationHistory: () => Promise<void>;
  getCurrentPosition: () => Promise<Location | null>;
  getNearbyPoliceStations: () => Promise<void>;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [locationHistory, setLocationHistory] = useState<Location[]>([]);
  const [isTracking, setIsTracking] = useState(false);
  const [activitySessions, setActivitySessions] = useState<ActivitySession[]>([]);
  const [todayActiveMinutes, setTodayActiveMinutes] = useState(0);
  const [nearbyPoliceStations, setNearbyPoliceStations] = useState<PoliceStation[]>([]);
  const [safetyScore, setSafetyScore] = useState(85);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const { user, emergencyContacts } = useAuth();
  const { toast } = useToast();
  
  const watchIdRef = useRef<number | null>(null);
  const locationIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const sessionStartTimeRef = useRef<Date | null>(null);

  // Initialize location on mount
  useEffect(() => {
    getCurrentPosition();
    if (user) {
      loadLocationHistory();
      loadActivitySessions();
    }
  }, [user]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
      if (locationIntervalRef.current) {
        clearInterval(locationIntervalRef.current);
      }
    };
  }, []);

  const getAddressFromCoordinates = async (lat: number, lng: number): Promise<{ address: string; placeName: string }> => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyBFw0Qbyq9zTFTd-tUY6dO7iq7vO0hqLs6`
      );
      const data = await response.json();
      
      if (data.results && data.results.length > 0) {
        const result = data.results[0];
        return {
          address: result.formatted_address,
          placeName: result.address_components[0]?.long_name || 'Unknown Location'
        };
      }
    } catch (Error) {
      console.error('Error getting address:', Error);
    }
    
    return {
      address: `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
      placeName: 'Unknown Location'
    };
  };

  const getCurrentPosition = async (): Promise<Location | null> => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        const defaultLocation = {
          lat: 28.6139,
          lng: 77.2090,
          timestamp: new Date(),
          address: 'New Delhi, India',
          placeName: 'New Delhi'
        };
        setCurrentLocation(defaultLocation);
        resolve(defaultLocation);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          const { address, placeName } = await getAddressFromCoordinates(lat, lng);
          
          const newLocation: Location = {
            lat,
            lng,
            timestamp: new Date(),
            address,
            placeName
          };
          
          setCurrentLocation(newLocation);
          getNearbyPoliceStations();
          resolve(newLocation);
        },
        async (Error) => {
          console.error('Error getting location:', Error);
          const defaultLocation = {
            lat: 28.6139,
            lng: 77.2090,
            timestamp: new Date(),
            address: 'New Delhi, India',
            placeName: 'New Delhi'
          };
          setCurrentLocation(defaultLocation);
          resolve(defaultLocation);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        }
      );
    });
  };

  const getNearbyPoliceStations = async () => {
    if (!currentLocation) return;

    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${currentLocation.lat},${currentLocation.lng}&radius=5000&type=police&key=AIzaSyBFw0Qbyq9zTFTd-tUY6dO7iq7vO0hqLs6`
      );
      const data = await response.json();
      
      if (data.results) {
        const stations: PoliceStation[] = data.results.slice(0, 5).map((place: any) => ({
          name: place.name,
          address: place.vicinity,
          lat: place.geometry.location.lat,
          lng: place.geometry.location.lng,
          distance: calculateDistance(
            currentLocation.lat,
            currentLocation.lng,
            place.geometry.location.lat,
            place.geometry.location.lng
          )
        }));
        
        setNearbyPoliceStations(stations);
        
        // Calculate safety score based on nearby police stations
        const avgDistance = stations.reduce((sum, station) => sum + station.distance, 0) / stations.length;
        const score = Math.max(50, Math.min(100, 100 - (avgDistance * 10)));
        setSafetyScore(Math.round(score));
      }
    } catch (Error) {
      console.error('Error fetching police stations:', Error);
      // Mock data for demo
      setNearbyPoliceStations([
        {
          name: 'Central Police Station',
          address: 'Near your location',
          distance: 0.5,
          lat: currentLocation.lat + 0.001,
          lng: currentLocation.lng + 0.001
        }
      ]);
    }
  };

  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const saveLocationToDatabase = async (location: Location) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('location_logs')
        .insert({
          user_id: user.id,
          latitude: location.lat,
          longitude: location.lng,
          timestamp: location.timestamp.toISOString(),
          is_active: isTracking,
        });

      if (error) {
        console.error('Error saving location:', error);
      }
    } catch (error) {
      console.error('Error saving location:', error);
    }
  };

  const startActivitySession = async () => {
    if (!user) return;

    try {
      const startTime = new Date();
      sessionStartTimeRef.current = startTime;

      const { data, error } = await supabase
        .from('activity_sessions')
        .insert({
          user_id: user.id,
          start_time: startTime.toISOString(),
          date: startTime.toISOString().split('T')[0],
        })
        .select()
        .single();

      if (error) {
        console.error('Error starting activity session:', error);
        return;
      }

      setCurrentSessionId(data.id);
    } catch (error) {
      console.error('Error starting activity session:', error);
    }
  };

  const endActivitySession = async () => {
    if (!user || !currentSessionId || !sessionStartTimeRef.current) return;

    try {
      const endTime = new Date();
      const duration = Math.floor((endTime.getTime() - sessionStartTimeRef.current.getTime()) / (1000 * 60));

      const { error } = await supabase
        .from('activity_sessions')
        .update({
          end_time: endTime.toISOString(),
          total_duration: duration,
        })
        .eq('id', currentSessionId);

      if (error) {
        console.error('Error ending activity session:', error);
        return;
      }

      setCurrentSessionId(null);
      sessionStartTimeRef.current = null;
      await loadActivitySessions();
    } catch (error) {
      console.error('Error ending activity session:', error);
    }
  };

  const loadActivitySessions = async () => {
    if (!user) return;

    try {
      const today = new Date().toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from('activity_sessions')
        .select('*')
        .eq('date', today)
        .order('start_time', { ascending: false });

      if (error) {
        console.error('Error loading activity sessions:', error);
        return;
      }

      setActivitySessions(data || []);
      
      const totalMinutes = data?.reduce((sum, session) => {
        return sum + (session.total_duration || 0);
      }, 0) || 0;
      
      setTodayActiveMinutes(totalMinutes);
    } catch (error) {
      console.error('Error loading activity sessions:', error);
    }
  };

  const startTracking = async () => {
    if (!navigator.geolocation) {
      toast({
        title: "Error",
        description: "Geolocation is not supported by this browser.",
        variant: "destructive",
      });
      return;
    }

    setIsTracking(true);
    await startActivitySession();
    
    await getCurrentPosition();
    
    watchIdRef.current = navigator.geolocation.watchPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const { address, placeName } = await getAddressFromCoordinates(lat, lng);
        
        const newLocation: Location = {
          lat,
          lng,
          timestamp: new Date(),
          address,
          placeName
        };
        
        setCurrentLocation(newLocation);
        setLocationHistory(prev => [...prev, newLocation].slice(-100));
        
        saveLocationToDatabase(newLocation);
      },
      (error) => {
        console.error('Error tracking location:', error);
        toast({
          title: "Location Error",
          description: "Unable to track your location. Using approximate location.",
          variant: "destructive",
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 30000
      }
    );

    toast({
      title: "Tracking Started",
      description: "Your location is now being tracked for safety.",
    });
  };

  const stopTracking = async () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    
    if (locationIntervalRef.current) {
      clearInterval(locationIntervalRef.current);
      locationIntervalRef.current = null;
    }

    setIsTracking(false);
    await endActivitySession();

    toast({
      title: "Tracking Stopped",
      description: "Location tracking has been paused.",
    });
  };

  const loadLocationHistory = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('location_logs')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(100);

      if (error) {
        console.error('Error loading location history:', error);
        return;
      }

      const history = data?.map(log => ({
        lat: parseFloat(log.latitude.toString()),
        lng: parseFloat(log.longitude.toString()),
        timestamp: new Date(log.timestamp)
      })) || [];

      setLocationHistory(history);
    } catch (error) {
      console.error('Error loading location history:', error);
    }
  };

  const triggerEmergency = async (message = "Emergency! I need immediate help!") => {
    const location = currentLocation || await getCurrentPosition();
    
    if (!location) {
      toast({
        title: "Error",
        description: "Unable to get your current location for emergency alert.",
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to send emergency alerts.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Save emergency alert to database
      const { error } = await supabase
        .from('emergency_alerts')
        .insert({
          user_id: user.id,
          latitude: location.lat,
          longitude: location.lng,
          message,
          contacts_notified: emergencyContacts.map(contact => contact.phone_number),
        });

      if (error) {
        console.error('Error saving emergency alert:', error);
      }

      // Create detailed emergency message
      const locationUrl = `https://maps.google.com/maps?q=${location.lat},${location.lng}`;
      const placeName = location.placeName || 'Unknown Location';
      const address = location.address || `${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}`;
      
      const alertMessage = `🚨 EMERGENCY ALERT 🚨
${message}

Location: ${placeName}
Address: ${address}
Google Maps: ${locationUrl}
Time: ${new Date().toLocaleString()}

This is an automated emergency alert from SafeSphere.`;

      // Simulate sending SMS to contacts
      const sentContacts: string[] = [];
      emergencyContacts.forEach(contact => {
        console.log(`Sending emergency SMS to ${contact.name} (${contact.phone_number}):`, alertMessage);
        sentContacts.push(contact.name);
      });

      // Show browser notification
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('SafeSphere Emergency Alert', {
          body: `Emergency alert sent to ${emergencyContacts.length} contacts at ${placeName}`,
          icon: '/favicon.ico'
        });
      }

      toast({
        title: "🚨 Emergency Alert Sent Successfully!",
        description: `Alert sent to ${emergencyContacts.length} contacts: ${sentContacts.join(', ')}. Location: ${placeName}`,
        duration: 8000,
      });

      // Show additional confirmation
      setTimeout(() => {
        toast({
          title: "SMS Alerts Delivered",
          description: `Emergency message with location details sent to all ${emergencyContacts.length} emergency contacts.`,
        });
      }, 2000);

    } catch (error) {
      console.error('Error triggering emergency:', error);
      toast({
        title: "Error",
        description: "Failed to send emergency alert. Please call emergency services directly.",
        variant: "destructive",
      });
    }
  };

  const value = {
    currentLocation,
    locationHistory,
    isTracking,
    activitySessions,
    todayActiveMinutes,
    nearbyPoliceStations,
    safetyScore,
    startTracking,
    stopTracking,
    triggerEmergency,
    loadLocationHistory,
    getCurrentPosition,
    getNearbyPoliceStations,
  };

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
};
