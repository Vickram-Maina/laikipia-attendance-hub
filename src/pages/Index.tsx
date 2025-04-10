
import { Navigate } from "react-router-dom";

const Index = () => {
  // Simply redirect to the dashboard component
  return <Navigate to="/" replace />;
};

export default Index;
