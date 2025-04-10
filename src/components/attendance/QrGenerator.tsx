
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { ClassSchedule } from "@/types";
import { Download, Share2 } from "lucide-react";

interface QrGeneratorProps {
  classDetails: ClassSchedule;
}

export function QrGenerator({ classDetails }: QrGeneratorProps) {
  const { toast } = useToast();
  const [showQr, setShowQr] = useState(false);
  
  const handleGenerateQr = () => {
    setShowQr(true);
    toast({
      title: "QR Code Generated",
      description: "Students can now scan this code to mark attendance",
    });
  };
  
  const handleShare = () => {
    toast({
      title: "QR Code Shared",
      description: "The QR code has been shared with the class",
    });
  };
  
  const handleDownload = () => {
    toast({
      title: "QR Code Downloaded",
      description: "The QR code has been saved to your device",
    });
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Attendance QR Code</CardTitle>
        <CardDescription>
          Generate a QR code for students to scan and mark attendance
        </CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center py-4">
        {showQr ? (
          <div className="flex flex-col items-center">
            <div className="w-48 h-48 bg-white border border-border rounded-md p-4 flex items-center justify-center">
              <div className="w-full h-full bg-gray-100 rounded flex items-center justify-center">
                <div className="text-4xl font-bold text-laikipia-red">QR</div>
              </div>
            </div>
            <p className="mt-4 text-sm text-center text-muted-foreground">
              Valid for the next 15 minutes
            </p>
          </div>
        ) : (
          <Button 
            onClick={handleGenerateQr} 
            className="bg-laikipia-red hover:bg-rose-600"
          >
            Generate QR Code
          </Button>
        )}
      </CardContent>
      {showQr && (
        <CardFooter className="flex gap-2 justify-center">
          <Button variant="outline" size="sm" onClick={handleShare}>
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownload}>
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
