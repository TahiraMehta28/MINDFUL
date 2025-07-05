
import { Link } from "react-router-dom";
import { Shield, Home, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-200 via-sage-100 to-white flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        <div className="mb-8">
          <Shield className="h-16 w-16 text-sage-600 mx-auto mb-4" />
          <h1 className="text-6xl font-bold text-sage-800 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-sage-700 mb-2">Page Not Found</h2>
          <p className="text-sage-600 mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <div className="space-y-4">
          <Link to="/">
            <Button className="w-full bg-sage-600 hover:bg-sage-700">
              <Home className="h-4 w-4 mr-2" />
              Return to SafeSphere Home
            </Button>
          </Link>
          
          <Link to="/emergency">
            <Button variant="outline" className="w-full border-emergency text-emergency hover:bg-emergency hover:text-white">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Emergency Access
            </Button>
          </Link>
        </div>

        <div className="mt-8 text-sm text-sage-600">
          <p>Need immediate help? Call <a href="tel:911" className="font-semibold text-emergency underline">911</a></p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
