
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QrCode } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";

export function QrAttendance() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  
  const handleScanClick = () => {
    setOpen(true);
  };
  
  const handleSuccess = () => {
    setOpen(false);
    toast({
      title: "Attendance Marked",
      description: "Your attendance has been successfully recorded",
    });
  };
  
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Attendance</CardTitle>
          <CardDescription>Scan QR code to mark your attendance</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-4">
          <QrCode className="h-20 w-20 text-laikipia-red opacity-90" />
        </CardContent>
        <CardFooter>
          <Button 
            onClick={handleScanClick} 
            className="w-full bg-laikipia-red hover:bg-rose-600"
          >
            Scan QR Code
          </Button>
        </CardFooter>
      </Card>
      
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Scan QR Code</DialogTitle>
            <DialogDescription>
              Position the QR code within the scanner frame
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center py-6">
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
            <Button 
              onClick={handleSuccess} 
              className="mt-6 bg-laikipia-red hover:bg-rose-600"
            >
              Simulate Successful Scan
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
