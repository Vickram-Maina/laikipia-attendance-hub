
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ClassSchedule, CourseClass } from "@/types";
import { Clock, MapPin, QrCode } from "lucide-react";
import { getCourseById } from "@/lib/mock-data";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { format, parseISO } from "date-fns";

interface ClassCardProps {
  classSchedule: ClassSchedule;
}

export function ClassCard({ classSchedule }: ClassCardProps) {
  const course = getCourseById(classSchedule.courseId);
  
  if (!course) return null;
  
  const formattedDate = format(parseISO(classSchedule.date), "EEE, MMM d, yyyy");
  const isToday = classSchedule.date === new Date().toISOString().split('T')[0];
  const isPast = new Date(classSchedule.date) < new Date(new Date().setHours(0,0,0,0));
  
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{course.courseName}</CardTitle>
            <p className="text-sm text-muted-foreground">{course.courseCode}</p>
          </div>
          {isToday && (
            <Badge className="bg-laikipia-red hover:bg-rose-600">Today</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-2">
          <div className="flex items-center text-sm">
            <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>{formattedDate}</span>
            <span className="mx-1">•</span>
            <span>{classSchedule.startTime} - {classSchedule.endTime}</span>
          </div>
          <div className="flex items-center text-sm">
            <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>{classSchedule.venue}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        {!isPast ? (
          <Button asChild className="w-full bg-laikipia-red hover:bg-rose-600">
            <Link to={`/classes/${classSchedule.id}`}>
              {isToday ? "Mark Attendance" : "View Details"}
            </Link>
          </Button>
        ) : (
          <Button variant="outline" asChild className="w-full">
            <Link to={`/classes/${classSchedule.id}`}>
              View Attendance Record
            </Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
