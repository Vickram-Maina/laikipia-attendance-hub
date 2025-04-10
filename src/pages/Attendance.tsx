
import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Check, Clock, FileDown, Search, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { attendanceRecords, classSchedules, courses, getCourseById, getClassScheduleById } from "@/lib/mock-data";
import { format, parseISO } from "date-fns";

export default function Attendance() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  
  if (!user) return null;
  
  const isLecturer = user.role === "lecturer";
  
  // Filter records for the current user if student
  const userAttendanceRecords = isLecturer 
    ? attendanceRecords 
    : attendanceRecords.filter(record => record.studentId === user.id);
  
  // Apply filters
  const filteredRecords = userAttendanceRecords.filter(record => {
    const classSchedule = getClassScheduleById(record.classScheduleId);
    if (!classSchedule) return false;
    
    const course = getCourseById(classSchedule.courseId);
    if (!course) return false;
    
    // Course filter
    if (selectedCourse !== "all" && classSchedule.courseId !== selectedCourse) {
      return false;
    }
    
    // Status filter
    if (selectedStatus !== "all" && record.status !== selectedStatus) {
      return false;
    }
    
    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        course.courseName.toLowerCase().includes(searchLower) ||
        course.courseCode.toLowerCase().includes(searchLower) ||
        classSchedule.venue.toLowerCase().includes(searchLower)
      );
    }
    
    return true;
  });
  
  return (
    <Layout>
      <div className="mt-6 lg:mt-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Attendance Records</h1>
            <p className="text-muted-foreground">
              {isLecturer 
                ? "View and manage attendance for all classes"
                : "Track your attendance across all courses"
              }
            </p>
          </div>
          
          <Button variant="outline" className="shrink-0">
            <FileDown className="mr-2 h-4 w-4" />
            Export Data
          </Button>
        </div>
        
        <div className="mt-6 space-y-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search courses, dates..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Select value={selectedCourse} onValueChange={setSelectedCourse}>
              <SelectTrigger className="w-full sm:w-44">
                <SelectValue placeholder="All Courses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Courses</SelectItem>
                {courses.map(course => (
                  <SelectItem key={course.id} value={course.id}>
                    {course.courseCode}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-full sm:w-44">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="present">Present</SelectItem>
                <SelectItem value="absent">Absent</SelectItem>
                <SelectItem value="late">Late</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Venue</TableHead>
                  <TableHead>Status</TableHead>
                  {isLecturer && <TableHead>Student</TableHead>}
                  <TableHead>Marked By</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecords.length > 0 ? (
                  filteredRecords.map(record => {
                    const classSchedule = getClassScheduleById(record.classScheduleId);
                    if (!classSchedule) return null;
                    
                    const course = getCourseById(classSchedule.courseId);
                    if (!course) return null;
                    
                    return (
                      <TableRow key={record.id}>
                        <TableCell>
                          {format(parseISO(classSchedule.date), "MMM d, yyyy")}
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{course.courseCode}</div>
                            <div className="text-xs text-muted-foreground">{course.courseName}</div>
                          </div>
                        </TableCell>
                        <TableCell>{classSchedule.startTime} - {classSchedule.endTime}</TableCell>
                        <TableCell>{classSchedule.venue}</TableCell>
                        <TableCell>
                          <Badge
                            className={
                              record.status === "present"
                                ? "bg-green-500 hover:bg-green-600"
                                : record.status === "late"
                                ? "bg-amber-500 hover:bg-amber-600"
                                : "bg-red-500 hover:bg-red-600"
                            }
                          >
                            {record.status === "present" && (
                              <Check className="mr-1 h-3 w-3" />
                            )}
                            {record.status === "late" && (
                              <Clock className="mr-1 h-3 w-3" />
                            )}
                            {record.status === "absent" && (
                              <X className="mr-1 h-3 w-3" />
                            )}
                            {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                          </Badge>
                        </TableCell>
                        {isLecturer && (
                          <TableCell>
                            {users.find(u => u.id === record.studentId)?.name || "Unknown"}
                          </TableCell>
                        )}
                        <TableCell>
                          <Badge variant="outline">
                            {record.markedBy === "student" ? "Self" : "Lecturer"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={isLecturer ? 7 : 6} className="text-center py-6">
                      <div className="text-muted-foreground">
                        No attendance records found matching your filters
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
