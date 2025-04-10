
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 py-12">
      <div className="size-16 rounded-full bg-laikipia-red flex items-center justify-center text-white font-bold mb-6">
        404
      </div>
      <h1 className="text-3xl font-bold">Page Not Found</h1>
      <p className="mt-2 text-muted-foreground text-center max-w-md">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Button
        onClick={() => navigate("/")}
        className="mt-8 bg-laikipia-red hover:bg-rose-600"
      >
        Back to Dashboard
      </Button>
    </div>
  );
}
