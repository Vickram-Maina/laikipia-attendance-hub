
import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { QrCode, CheckCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function ScanQR() {
  const [scanning, setScanning] = useState(false);
  const [success, setSuccess] = useState(false);
  const { toast } = useToast();
  
  const handleStartScan = () => {
    setScanning(true);
  };
  
  const handleSimulateSuccess = () => {
    setScanning(false);
    setSuccess(true);
    toast({
      title: "Attendance Marked",
      description: "Your attendance has been successfully recorded",
    });
    
    // Reset after a few seconds
    setTimeout(() => {
      setSuccess(false);
    }, 3000);
  };
  
  return (
    <Layout>
      <div className="mt-6 lg:mt-8">
        <h1 className="text-2xl font-bold tracking-tight">QR Code Scanner</h1>
        <p className="text-muted-foreground">
          Scan the QR code displayed by your lecturer to mark your attendance
        </p>
        
        <div className="mt-8 flex justify-center">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <CardTitle>Attendance QR Scanner</CardTitle>
              <CardDescription>
                Point your camera at the QR code to record your attendance
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center py-6">
              {!scanning && !success ? (
                <div className="text-center">
                  <QrCode className="h-32 w-32 mx-auto text-laikipia-red opacity-80" />
                  <p className="mt-4 text-sm text-muted-foreground">
                    Ready to scan attendance QR code
                  </p>
                </div>
              ) : success ? (
                <div className="text-center text-green-600">
                  <CheckCircle className="h-32 w-32 mx-auto" />
                  <p className="mt-4 font-medium">Attendance Recorded Successfully!</p>
                </div>
              ) : (
                <div className="relative h-64 w-64 overflow-hidden rounded-lg border border-dashed">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Camera not available in demo</p>
                      <p className="mt-2 text-xs text-muted-foreground">This would access your camera in a real app</p>
                    </div>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-48 w-48 border-2 border-white/50 animate-pulse-slow"></div>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-center">
              {!scanning && !success ? (
                <Button 
                  onClick={handleStartScan} 
                  className="bg-laikipia-red hover:bg-rose-600"
                >
                  Start Scanning
                </Button>
              ) : scanning ? (
                <Button 
                  onClick={handleSimulateSuccess}
                  className="bg-laikipia-red hover:bg-rose-600"
                >
                  Simulate Successful Scan
                </Button>
              ) : (
                <Button 
                  onClick={() => setSuccess(false)}
                  variant="outline"
                >
                  Scan Another Code
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
