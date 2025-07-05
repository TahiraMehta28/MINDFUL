
import React, { useState, useEffect } from 'react';
import { AlertTriangle, Phone, MessageSquare, MapPin, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLocation } from '@/contexts/LocationContext';
import { useAuth } from '@/contexts/AuthContext';
import EmergencyButton from '@/components/EmergencyButton';

const Emergency = () => {
  const [customMessage, setCustomMessage] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());
  const { currentLocation, getCurrentPosition, triggerEmergency } = useLocation();
  const { isAuthenticated, emergencyContacts } = useAuth();

  useEffect(() => {
    // Get current location immediately
    getCurrentPosition();
    
    // Update time every second
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleCustomEmergency = async () => {
    const message = customMessage.trim() || "Emergency! I need immediate help!";
    await triggerEmergency(message);
    setCustomMessage('');
  };

  const quickMessages = [
    "I'm in danger and need help immediately!",
    "Someone is following me. Please help!",
    "I'm feeling unsafe in my current location.",
    "Medical emergency - need assistance now!",
    "Vehicle breakdown - need immediate help!"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <AlertTriangle className="h-12 w-12 text-emergency animate-pulse" />
          </div>
          <h1 className="text-4xl font-bold text-emergency mb-2">Emergency Access</h1>
          <p className="text-gray-700 text-lg">Get help immediately - no login required</p>
        </div>

        {/* Current Status */}
        <Card className="mb-8 border-l-4 border-l-emergency">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div>
                <Clock className="h-6 w-6 mx-auto mb-2 text-sage-600" />
                <div className="font-semibold text-sage-800">Current Time</div>
                <div className="text-sm text-sage-600">{currentTime.toLocaleString()}</div>
              </div>
              <div>
                <MapPin className="h-6 w-6 mx-auto mb-2 text-sage-600" />
                <div className="font-semibold text-sage-800">Location Status</div>
                <div className="text-sm text-sage-600">
                  {currentLocation ? 'Location Available' : 'Getting Location...'}
                </div>
              </div>
              <div>
                <Phone className="h-6 w-6 mx-auto mb-2 text-sage-600" />
                <div className="font-semibold text-sage-800">Emergency Contacts</div>
                <div className="text-sm text-sage-600">
                  {isAuthenticated ? `${emergencyContacts.length} contacts` : 'Not logged in'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Emergency Actions */}
          <div className="space-y-6">
            {/* Main Emergency Button */}
            <Card>
              <CardHeader>
                <CardTitle className="text-emergency">Immediate Emergency Alert</CardTitle>
              </CardHeader>
              <CardContent>
                <EmergencyButton size="large" />
                {!isAuthenticated && (
                  <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    <p className="text-sm text-yellow-800">
                      <strong>Note:</strong> You're not logged in. Emergency services will be contacted, 
                      but personal contacts won't be notified.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Custom Message */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sage-800">Custom Emergency Message</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  placeholder="Describe your emergency situation (optional)..."
                  rows={3}
                  className="resize-none"
                />
                <Button
                  onClick={handleCustomEmergency}
                  className="w-full bg-emergency hover:bg-emergency-hover"
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Send Custom Emergency Alert
                </Button>
              </CardContent>
            </Card>

            {/* Quick Messages */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sage-800">Quick Emergency Messages</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {quickMessages.map((message, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="w-full text-left justify-start h-auto p-3 border-sage-200 hover:bg-sage-50"
                    onClick={() => triggerEmergency(message)}
                  >
                    <span className="text-sm">{message}</span>
                  </Button>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Help & Contacts */}
          <div className="space-y-6">
            {/* Direct Emergency Services */}
            <Card>
              <CardHeader>
                <CardTitle className="text-emergency">Emergency Services (India)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  asChild
                  className="w-full bg-emergency hover:bg-emergency-hover text-white"
                >
                  <a href="tel:112" className="flex items-center justify-center">
                    <Phone className="h-4 w-4 mr-2" />
                    Call 112 - National Emergency
                  </a>
                </Button>
                
                <div className="grid grid-cols-2 gap-3">
                  <Button asChild variant="outline" className="border-emergency text-emergency hover:bg-emergency hover:text-white">
                    <a href="tel:100" className="flex items-center justify-center">
                      <Phone className="h-3 w-3 mr-1" />
                      Police: 100
                    </a>
                  </Button>
                  <Button asChild variant="outline" className="border-emergency text-emergency hover:bg-emergency hover:text-white">
                    <a href="tel:108" className="flex items-center justify-center">
                      <Phone className="h-3 w-3 mr-1" />
                      Ambulance: 108
                    </a>
                  </Button>
                  <Button asChild variant="outline" className="border-emergency text-emergency hover:bg-emergency hover:text-white">
                    <a href="tel:101" className="flex items-center justify-center">
                      <Phone className="h-3 w-3 mr-1" />
                      Fire: 101
                    </a>
                  </Button>
                  <Button asChild variant="outline" className="border-emergency text-emergency hover:bg-emergency hover:text-white">
                    <a href="tel:1091" className="flex items-center justify-center">
                      <Phone className="h-3 w-3 mr-1" />
                      Women: 1091
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Location Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sage-800">Your Location</CardTitle>
              </CardHeader>
              <CardContent>
                {currentLocation ? (
                  <div className="space-y-3">
                    <div className="text-sm">
                      <strong>Coordinates:</strong><br />
                      Lat: {currentLocation.lat.toFixed(6)}<br />
                      Lng: {currentLocation.lng.toFixed(6)}
                    </div>
                    <div className="text-sm">
                      <strong>Updated:</strong> {currentLocation.timestamp.toLocaleString()}
                    </div>
                    <Button
                      asChild
                      variant="outline"
                      className="w-full border-sage-300 text-sage-700"
                    >
                      <a
                        href={`https://maps.google.com/maps?q=${currentLocation.lat},${currentLocation.lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <MapPin className="h-4 w-4 mr-2" />
                        View on Google Maps
                      </a>
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sage-600 mx-auto mb-4"></div>
                    <p className="text-sage-600">Getting your location...</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Important Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sage-800">Important Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-sage-700">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <strong>When calling emergency services:</strong>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Stay calm and speak clearly</li>
                    <li>Provide your location first</li>
                    <li>Describe the emergency</li>
                    <li>Follow the operator's instructions</li>
                  </ul>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <strong>Your location is being tracked</strong> and will be shared with emergency services to help them find you quickly.
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Emergency;
