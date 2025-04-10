
import { useParams, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { format, parseISO } from "date-fns";
import { getClassScheduleById, getCourseById } from "@/lib/mock-data";
import { useAuth } from "@/contexts/AuthContext";
import { AttendanceTable } from "@/components/attendance/AttendanceTable";
import { QrGenerator } from "@/components/attendance/QrGenerator";
import { QrAttendance } from "@/components/dashboard/QrAttendance";
import { ArrowLeft, Calendar, Clock, MapPin } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ClassDetail() {
  const { classId } = useParams<{ classId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  if (!classId) {
    return <div>Class ID is required</div>;
  }
  
  const classDetails = getClassScheduleById(classId);
  if (!classDetails) {
    return <div>Class not found</div>;
  }
  
  const course = getCourseById(classDetails.courseId);
  if (!course) {
    return <div>Course not found</div>;
  }
  
  const isLecturer = user?.role === "lecturer";
  const formattedDate = format(parseISO(classDetails.date), "EEEE, MMMM d, yyyy");
  const isPastClass = new Date(classDetails.date) < new Date(new Date().setHours(0,0,0,0));
  const isToday = classDetails.date === new Date().toISOString().split('T')[0];
  
  return (
    <Layout>
      <div className="mt-6 lg:mt-8">
        <Button
          variant="ghost"
          className="mb-4"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{course.courseName}</h1>
            <p className="text-muted-foreground">{course.courseCode}</p>
          </div>
          
          {isLecturer && (
            <Button 
              variant={isPastClass ? "outline" : "default"}
              className={!isPastClass ? "bg-laikipia-red hover:bg-rose-600" : ""}
              disabled={isPastClass}
            >
              {isPastClass ? "Class Ended" : "Edit Class"}
            </Button>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="flex flex-col p-4 rounded-lg border">
            <div className="flex items-center text-sm mb-2">
              <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
              <span>Date</span>
            </div>
            <span className="font-medium">{formattedDate}</span>
          </div>
          
          <div className="flex flex-col p-4 rounded-lg border">
            <div className="flex items-center text-sm mb-2">
              <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
              <span>Time</span>
            </div>
            <span className="font-medium">{classDetails.startTime} - {classDetails.endTime}</span>
          </div>
          
          <div className="flex flex-col p-4 rounded-lg border">
            <div className="flex items-center text-sm mb-2">
              <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
              <span>Venue</span>
            </div>
            <span className="font-medium">{classDetails.venue}</span>
          </div>
        </div>
        
        {isLecturer ? (
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <h2 className="text-xl font-semibold mb-4">Attendance Register</h2>
              <AttendanceTable 
                classScheduleId={classDetails.id} 
                classDetails={classDetails} 
              />
            </div>
            <div>
              {!isPastClass && (
                <QrGenerator classDetails={classDetails} />
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">Class Attendance</h2>
              {isPastClass ? (
                <AttendanceTable 
                  classScheduleId={classDetails.id} 
                  classDetails={classDetails} 
                />
              ) : (
                <div className="grid md:grid-cols-2 gap-6">
                  <QrAttendance />
                  <div className="bg-muted p-6 rounded-lg flex flex-col items-center justify-center text-center">
                    <h3 className="text-lg font-medium mb-2">Manual Attendance</h3>
                    <p className="text-muted-foreground mb-4">
                      If you can't scan the QR code, please contact your lecturer to mark your attendance manually.
                    </p>
                    <Button variant="outline">
                      Request Manual Attendance
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
