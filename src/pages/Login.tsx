
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [role, setRole] = useState<"student" | "lecturer">("student");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // For demo purposes, prepopulate email if empty
      const emailToUse = email.trim() || (role === "student" 
        ? "awanjiku@students.laikipia.ac.ke" 
        : "jsmith@laikipia.ac.ke");
      
      const success = await login(emailToUse, password);
      if (success) {
        navigate("/");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoleChange = (value: string) => {
    setRole(value as "student" | "lecturer");
    // Clear email when switching roles to avoid confusion
    setEmail("");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-laikipia-gray to-laikipia-light p-4">
      <div className="mb-8 text-center">
        <div className="flex justify-center mb-4">
          <div className="h-16 w-16 rounded-full bg-laikipia-red flex items-center justify-center text-white text-xl font-bold">
            LU
          </div>
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Laikipia University</h1>
        <p className="text-lg text-muted-foreground">Attendance Management System</p>
      </div>
      
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Login to your account</CardTitle>
          <CardDescription className="text-center">
            Enter your credentials below to access the system
          </CardDescription>
        </CardHeader>
        <Tabs defaultValue="student" onValueChange={handleRoleChange}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="student">Student</TabsTrigger>
            <TabsTrigger value="lecturer">Lecturer</TabsTrigger>
          </TabsList>
          <TabsContent value="student">
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Student Email</Label>
                    <Input
                      id="email"
                      placeholder="your.name@students.laikipia.ac.ke"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Demo: awanjiku@students.laikipia.ac.ke
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Any password will work for this demo
                    </p>
                  </div>
                  <Button type="submit" className="w-full bg-laikipia-red hover:bg-rose-600" disabled={isLoading}>
                    {isLoading ? "Logging in..." : "Login"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </TabsContent>
          <TabsContent value="lecturer">
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="lecturer-email">Lecturer Email</Label>
                    <Input
                      id="lecturer-email"
                      placeholder="your.name@laikipia.ac.ke"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Demo: jsmith@laikipia.ac.ke
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lecturer-password">Password</Label>
                    <Input
                      id="lecturer-password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Any password will work for this demo
                    </p>
                  </div>
                  <Button type="submit" className="w-full bg-laikipia-red hover:bg-rose-600" disabled={isLoading}>
                    {isLoading ? "Logging in..." : "Login"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </TabsContent>
        </Tabs>
        <CardFooter className="flex-col space-y-4 pt-0">
          <div className="text-center text-sm text-muted-foreground mt-4">
            <a href="#" className="underline underline-offset-4 hover:text-laikipia-red">
              Forgot your password?
            </a>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
