
import { Link } from "react-router-dom";
import { Shield, MapPin, Phone, Users, AlertTriangle, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-200 via-sage-100 to-white">
      {/* Navigation */}
      <nav className="bg-sage-600 text-white shadow-sage">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Shield className="h-8 w-8" />
              <span className="text-2xl font-bold">SafeSphere</span>
            </div>
            <div className="flex space-x-4">
              {isAuthenticated ? (
                <Link to="/dashboard">
                  <Button variant="outline" className="bg-white text-sage-600 hover:bg-sage-50">
                    Dashboard
                  </Button>
                </Link>
              ) : (
                <>
                  <Link to="/login">
                    <Button variant="outline" className="bg-white text-sage-600 hover:bg-sage-50">
                      Login
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button className="bg-sage-500 hover:bg-sage-400">
                      Sign Up
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl font-bold text-sage-800 mb-6">
            Your Personal Safety Companion
          </h1>
          <p className="text-xl text-sage-600 mb-8 max-w-3xl mx-auto">
            SafeSphere provides real-time location tracking, emergency alerts, and instant access to help
            when you need it most. Feel confident and secure wherever you go.
          </p>
          <div className="flex justify-center space-x-4">
            <Link to="/register">
              <Button size="lg" className="bg-sage-600 hover:bg-sage-700 text-lg px-8 py-3">
                Get Started Free
              </Button>
            </Link>
            <Link to="/emergency">
              <Button size="lg" variant="outline" className="border-emergency text-emergency hover:bg-emergency hover:text-white text-lg px-8 py-3">
                Emergency Access
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6 bg-white/50">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center text-sage-800 mb-12">
            Comprehensive Safety Features
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-white shadow-sage border-sage-200 hover:shadow-lg transition-all">
              <CardHeader>
                <MapPin className="h-12 w-12 text-sage-600 mb-4" />
                <CardTitle className="text-sage-800">Real-Time Tracking</CardTitle>
                <CardDescription>
                  Live location monitoring with route history and safe zone alerts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sage-600">
                  Continuous GPS tracking with smart alerts when entering or leaving designated safe areas.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-sage border-sage-200 hover:shadow-lg transition-all">
              <CardHeader>
                <AlertTriangle className="h-12 w-12 text-emergency mb-4" />
                <CardTitle className="text-sage-800">Panic Button</CardTitle>
                <CardDescription>
                  One-tap emergency alerts to contacts and authorities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sage-600">
                  Instant SOS alerts with location sharing to emergency contacts and local police stations.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-sage border-sage-200 hover:shadow-lg transition-all">
              <CardHeader>
                <Phone className="h-12 w-12 text-sage-600 mb-4" />
                <CardTitle className="text-sage-800">Smart Notifications</CardTitle>
                <CardDescription>
                  Automated SMS alerts and inactivity detection
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sage-600">
                  AI-powered safety monitoring with automatic alerts when unusual patterns are detected.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-sage border-sage-200 hover:shadow-lg transition-all">
              <CardHeader>
                <Users className="h-12 w-12 text-sage-600 mb-4" />
                <CardTitle className="text-sage-800">Emergency Network</CardTitle>
                <CardDescription>
                  Connect with trusted contacts and local authorities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sage-600">
                  Build your safety network with family, friends, and nearby police stations.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-sage border-sage-200 hover:shadow-lg transition-all">
              <CardHeader>
                <Activity className="h-12 w-12 text-sage-600 mb-4" />
                <CardTitle className="text-sage-800">Safety Analytics</CardTitle>
                <CardDescription>
                  Insights into your daily routes and safety patterns
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sage-600">
                  Visual dashboards showing your movement patterns and safety insights.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-sage border-sage-200 hover:shadow-lg transition-all">
              <CardHeader>
                <Shield className="h-12 w-12 text-sage-600 mb-4" />
                <CardTitle className="text-sage-800">Privacy First</CardTitle>
                <CardDescription>
                  Your data is encrypted and secure
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sage-600">
                  End-to-end encryption ensures your location and personal data remain private.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6 bg-sage-600 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Feel Safer Every Day?
          </h2>
          <p className="text-xl mb-8 text-sage-100">
            Join thousands of users who trust SafeSphere for their personal safety.
          </p>
          <Link to="/register">
            <Button size="lg" className="bg-white text-sage-600 hover:bg-sage-50 text-lg px-8 py-3">
              Start Your Free Trial
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-sage-800 text-white py-8 px-6">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Shield className="h-6 w-6" />
            <span className="text-xl font-bold">SafeSphere</span>
          </div>
          <p className="text-sage-200">
            Empowering personal safety through technology. Available 24/7 for emergency assistance.
          </p>
          <p className="text-sage-300 text-sm mt-4">
            © 2024 SafeSphere. All rights reserved. | Emergency Hotline: 911
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
