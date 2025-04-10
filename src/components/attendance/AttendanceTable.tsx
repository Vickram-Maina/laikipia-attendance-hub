
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { users, attendanceRecords } from "@/lib/mock-data";
import { Check, Clock, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { AttendanceRecord, ClassSchedule } from "@/types";

interface AttendanceTableProps {
  classScheduleId: string;
  classDetails: ClassSchedule;
}

export function AttendanceTable({ classScheduleId, classDetails }: AttendanceTableProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const isLecturer = user?.role === "lecturer";
  
  // Filter students only
  const students = users.filter((user) => user.role === "student");
  
  // Get existing attendance records for this class
  const existingRecords = attendanceRecords.filter(
    (record) => record.classScheduleId === classScheduleId
  );
  
  // Initialize attendance status for each student
  const initialAttendance = students.map((student) => {
    const record = existingRecords.find(
      (record) => record.studentId === student.id
    );
    
    return {
      studentId: student.id,
      studentName: student.name,
      status: record?.status || "absent",
      markedBy: record?.markedBy || "lecturer",
    };
  });
  
  const [attendance, setAttendance] = useState(initialAttendance);
  
  const handleStatusChange = (studentId: string, status: "present" | "absent" | "late") => {
    if (!isLecturer) return;
    
    setAttendance(
      attendance.map((record) =>
        record.studentId === studentId
          ? { ...record, status, markedBy: "lecturer" }
          : record
      )
    );
    
    toast({
      title: "Attendance Updated",
      description: `${students.find((s) => s.id === studentId)?.name}'s status updated to ${status}`,
    });
  };
  
  const isPastClass = new Date(classDetails.date) < new Date(new Date().setHours(0,0,0,0));
  
  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">#</TableHead>
            <TableHead>Student Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Marked By</TableHead>
            {isLecturer && <TableHead className="text-right">Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {attendance.map((record, index) => (
            <TableRow key={record.studentId}>
              <TableCell className="font-medium">{index + 1}</TableCell>
              <TableCell>{record.studentName}</TableCell>
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
              <TableCell>
                <Badge variant="outline">
                  {record.markedBy === "student" ? "Self" : "Lecturer"}
                </Badge>
              </TableCell>
              {isLecturer && !isPastClass && (
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      size="sm"
                      variant={record.status === "present" ? "default" : "outline"}
                      className={record.status === "present" ? "bg-green-500 hover:bg-green-600" : ""}
                      onClick={() => handleStatusChange(record.studentId, "present")}
                    >
                      Present
                    </Button>
                    <Button
                      size="sm"
                      variant={record.status === "late" ? "default" : "outline"}
                      className={record.status === "late" ? "bg-amber-500 hover:bg-amber-600" : ""}
                      onClick={() => handleStatusChange(record.studentId, "late")}
                    >
                      Late
                    </Button>
                    <Button
                      size="sm"
                      variant={record.status === "absent" ? "default" : "outline"}
                      className={record.status === "absent" ? "bg-red-500 hover:bg-red-600" : ""}
                      onClick={() => handleStatusChange(record.studentId, "absent")}
                    >
                      Absent
                    </Button>
                  </div>
                </TableCell>
              )}
              {isLecturer && isPastClass && (
                <TableCell className="text-right text-muted-foreground">
                  <span className="text-xs">Class has ended</span>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
