
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Eye, EyeOff, LogIn, UserPlus, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    phoneNumber: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const { login, register, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        const { error } = await login(formData.email, formData.password);
        if (!error) {
          navigate('/dashboard');
        }
      } else {
        if (!formData.fullName || !formData.phoneNumber) {
          return;
        }
        const { error } = await register(formData.email, formData.password, formData.fullName, formData.phoneNumber);
        if (!error) {
          // Don't automatically redirect - let the user know about email verification
          // The AuthContext will handle the appropriate messaging
        }
      }
    } catch (error) {
      console.error('Authentication error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({
      email: '',
      password: '',
      fullName: '',
      phoneNumber: ''
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-200 via-sage-100 to-white flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Link to="/" className="flex items-center justify-center space-x-2 mb-6">
            <Shield className="h-10 w-10 text-sage-600" />
            <span className="text-3xl font-bold text-sage-800">SafeSphere</span>
          </Link>
          <h2 className="text-2xl font-bold text-sage-800 mb-2">
            {isLogin ? 'Welcome Back' : 'Join SafeSphere'}
          </h2>
          <p className="text-sage-600">
            {isLogin ? 'Sign in to your safety companion' : 'Create your safety companion account'}
          </p>
        </div>

        <Card>
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {!isLogin && (
                <>
                  <div>
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      type="text"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                      required={!isLogin}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <Input
                      id="phoneNumber"
                      name="phoneNumber"
                      type="tel"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      placeholder="+91 98765 43210"
                      required={!isLogin}
                      className="mt-1"
                    />
                  </div>
                </>
              )}
              
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  required
                  className="mt-1"
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-sage-600 hover:bg-sage-700"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {isLogin ? 'Signing In...' : 'Creating Account...'}
                  </div>
                ) : (
                  <>
                    {isLogin ? (
                      <>
                        <LogIn className="h-4 w-4 mr-2" />
                        Sign In
                      </>
                    ) : (
                      <>
                        <UserPlus className="h-4 w-4 mr-2" />
                        Create Account
                      </>
                    )}
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={toggleMode}
                className="text-sage-600 hover:text-sage-700 font-medium"
              >
                {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
              </button>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <Link to="/emergency" className="text-emergency hover:text-emergency-hover font-medium">
            <AlertTriangle className="h-4 w-4 inline mr-1" />
            Emergency Access (No Login Required)
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
