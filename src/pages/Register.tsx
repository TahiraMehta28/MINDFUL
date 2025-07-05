
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Eye, EyeOff, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    medicalInfo: '',
  });
  const [emergencyContacts, setEmergencyContacts] = useState(['']);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEmergencyContactChange = (index: number, value: string) => {
    const newContacts = [...emergencyContacts];
    newContacts[index] = value;
    setEmergencyContacts(newContacts);
  };

  const addEmergencyContact = () => {
    setEmergencyContacts([...emergencyContacts, '']);
  };

  const removeEmergencyContact = (index: number) => {
    setEmergencyContacts(emergencyContacts.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Password mismatch",
        description: "Passwords don't match. Please check and try again.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await register(formData.email, formData.password, formData.fullName, formData.phoneNumber);
      
      if (!error) {
        toast({
          title: "Welcome to SafeSphere!",
          description: "Your account has been created successfully.",
        });
        navigate('/dashboard');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-200 via-sage-100 to-white flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 text-sage-600 hover:text-sage-700">
            <Shield className="h-8 w-8" />
            <span className="text-2xl font-bold">SafeSphere</span>
          </Link>
        </div>

        <Card className="bg-white shadow-sage border-sage-200">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center text-sage-800">
              Create Your SafeSphere Account
            </CardTitle>
            <CardDescription className="text-center text-sage-600">
              Set up your personal safety network
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-sage-700">Full Name</Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Sarah Johnson"
                    required
                    className="border-sage-300 focus:border-sage-500 focus:ring-sage-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phoneNumber" className="text-sage-700">Phone Number</Label>
                  <Input
                    id="phoneNumber"
                    name="phoneNumber"
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    placeholder="+1 (555) 123-4567"
                    required
                    className="border-sage-300 focus:border-sage-500 focus:ring-sage-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sage-700">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="sarah@example.com"
                  required
                  className="border-sage-300 focus:border-sage-500 focus:ring-sage-500"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sage-700">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Create a strong password"
                      required
                      className="border-sage-300 focus:border-sage-500 focus:ring-sage-500 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sage-500 hover:text-sage-700"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-sage-700">Confirm Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="Confirm your password"
                      required
                      className="border-sage-300 focus:border-sage-500 focus:ring-sage-500 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sage-500 hover:text-sage-700"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sage-700">Emergency Contacts</Label>
                <p className="text-sm text-sage-600">Add phone numbers of people to contact in case of emergency</p>
                {emergencyContacts.map((contact, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      type="tel"
                      value={contact}
                      onChange={(e) => handleEmergencyContactChange(index, e.target.value)}
                      placeholder="+1 (555) 987-6543"
                      className="border-sage-300 focus:border-sage-500 focus:ring-sage-500"
                    />
                    {emergencyContacts.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeEmergencyContact(index)}
                        className="border-sage-300 text-sage-600 hover:bg-sage-50"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={addEmergencyContact}
                  className="border-sage-300 text-sage-600 hover:bg-sage-50"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Emergency Contact
                </Button>
              </div>

              <div className="space-y-2">
                <Label htmlFor="medicalInfo" className="text-sage-700">Medical Information (Optional)</Label>
                <Textarea
                  id="medicalInfo"
                  name="medicalInfo"
                  value={formData.medicalInfo}
                  onChange={handleInputChange}
                  placeholder="Allergies, medical conditions, medications, etc."
                  className="border-sage-300 focus:border-sage-500 focus:ring-sage-500"
                  rows={3}
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-sage-600 hover:bg-sage-700"
                disabled={isLoading}
              >
                {isLoading ? "Creating Account..." : "Create SafeSphere Account"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sage-600">
                Already have an account?{' '}
                <Link to="/login" className="text-sage-600 hover:text-sage-800 font-medium underline">
                  Sign in here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Register;
