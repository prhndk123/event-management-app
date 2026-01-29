import { Link } from "react-router";
import { Home } from "lucide-react";
import { Button } from "~/components/ui/button";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <div className="text-center">
        <h1 className="text-8xl font-bold text-primary mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-foreground mb-2">Page Not Found</h2>
        <p className="text-muted-foreground mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Button asChild>
          <Link to="/">
            <Home className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
