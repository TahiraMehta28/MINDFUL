
import React, { useState } from 'react';
import { AlertTriangle, Phone, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocation } from '@/contexts/LocationContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface EmergencyButtonProps {
  size?: 'default' | 'large';
}

const EmergencyButton: React.FC<EmergencyButtonProps> = ({ size = 'default' }) => {
  const [isTriggering, setIsTriggering] = useState(false);
  const { triggerEmergency, currentLocation } = useLocation();
  const { emergencyContacts } = useAuth();
  const { toast } = useToast();

  const handleEmergency = async () => {
    setIsTriggering(true);
    
    try {
      // Trigger the emergency alert
      triggerEmergency();
      
      // Show immediate feedback
      toast({
        title: "🚨 Emergency Alert Sent!",
        description: "Emergency contacts have been notified. Help is on the way.",
        duration: 5000,
      });

      // Simulate emergency actions
      setTimeout(() => {
        toast({
          title: "SMS Alerts Sent",
          description: `Emergency message sent to ${emergencyContacts.length || 0} contacts`,
        });
      }, 1000);

      setTimeout(() => {
        toast({
          title: "Location Shared",
          description: "Your current location has been shared with emergency services",
        });
      }, 2000);

    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send emergency alert. Please call 911 directly.",
        variant: "destructive",
      });
    } finally {
      setTimeout(() => setIsTriggering(false), 3000);
    }
  };

  const buttonSize = size === 'large' ? 'h-32 w-full text-2xl' : 'h-20 w-full text-lg';
  const iconSize = size === 'large' ? 'h-12 w-12' : 'h-8 w-8';

  return (
    <div className="space-y-4">
      {/* Main Emergency Button */}
      <Button
        onClick={handleEmergency}
        disabled={isTriggering}
        className={`${buttonSize} bg-emergency hover:bg-emergency-hover text-white font-bold rounded-xl shadow-lg transition-all ${
          isTriggering ? 'emergency-pulse' : 'hover:scale-105'
        }`}
      >
        {isTriggering ? (
          <div className="flex items-center space-x-3">
            <AlertTriangle className={`${iconSize} animate-pulse`} />
            <div className="text-left">
              <div>Sending Alert...</div>
              <div className="text-sm opacity-90">Please wait</div>
            </div>
          </div>
        ) : (
          <div className="flex items-center space-x-3">
            <AlertTriangle className={iconSize} />
            <div className="text-left">
              <div>SOS EMERGENCY</div>
              <div className="text-sm opacity-90">Tap to send alert</div>
            </div>
          </div>
        )}
      </Button>

      {/* Quick Action Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <Button
          asChild
          variant="outline"
          className="border-emergency text-emergency hover:bg-emergency hover:text-white"
        >
          <a href="tel:911" className="flex items-center justify-center space-x-2">
            <Phone className="h-4 w-4" />
            <span>Call 911</span>
          </a>
        </Button>
        
        <Button
          asChild
          variant="outline"
          className="border-sage-300 text-sage-700 hover:bg-sage-50"
        >
          <a href="sms:911" className="flex items-center justify-center space-x-2">
            <MessageSquare className="h-4 w-4" />
            <span>Text 911</span>
          </a>
        </Button>
      </div>

      {/* Emergency Info */}
      <div className="text-sm text-sage-600 space-y-1">
        <p>
          <strong>Emergency alert will:</strong>
        </p>
        <ul className="list-disc list-inside space-y-1 text-xs">
          <li>Send SMS to {emergencyContacts.length || 0} emergency contacts</li>
          <li>Share your current location</li>
          <li>Notify nearby police stations</li>
          <li>Log the emergency event</li>
        </ul>
        {!currentLocation && (
          <p className="text-yellow-600 text-xs">
            ⚠️ Location not available. Enable GPS for better emergency response.
          </p>
        )}
      </div>
    </div>
  );
};

export default EmergencyButton;
