
import { useAuth } from "@/contexts/AuthContext";
import { Layout } from "@/components/layout/Layout";
import { StatCard } from "@/components/dashboard/StatCard";
import { QrAttendance } from "@/components/dashboard/QrAttendance";
import { UpcomingClasses } from "@/components/dashboard/UpcomingClasses";
import { AttendanceChart } from "@/components/dashboard/AttendanceChart";
import { ClassCard } from "@/components/dashboard/ClassCard";
import { Calendar, CheckCircle, Clock, Users } from "lucide-react";
import { getTodayClasses, getStudentCourseAttendance, courses } from "@/lib/mock-data";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const { user } = useAuth();
  const [todayClasses, setTodayClasses] = useState(getTodayClasses());
  
  // Refresh today's classes when component mounts
  useEffect(() => {
    setTodayClasses(getTodayClasses());
  }, []);
  
  // Mock data for charts
  const studentAttendanceData = {
    present: 18,
    absent: 2,
    late: 4,
  };
  
  const lecturerAttendanceData = {
    present: 152,
    absent: 24,
    late: 18,
  };
  
  if (!user) return null;
  
  const isLecturer = user.role === "lecturer";
  
  // Calculate overall attendance rate for student
  const studentOverallAttendance = !isLecturer 
    ? courses.reduce((total, course) => {
        return total + getStudentCourseAttendance(user.id, course.id);
      }, 0) / courses.length
    : 0;
  
  return (
    <Layout>
      <div className="mt-6 lg:mt-8">
        <h1 className="text-2xl font-bold tracking-tight">
          Welcome back, {user.name.split(' ')[0]}
        </h1>
        <p className="text-muted-foreground">
          Here's an overview of your {isLecturer ? "classes and student attendance" : "attendance and upcoming classes"}
        </p>
        
        <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {isLecturer ? (
            <>
              <StatCard
                title="Total Students"
                value="87"
                icon={<Users className="h-4 w-4" />}
                trend="up"
                trendValue="12%"
              />
              <StatCard
                title="Classes Today"
                value={todayClasses.length}
                icon={<Calendar className="h-4 w-4" />}
              />
              <StatCard
                title="Average Attendance"
                value="85%"
                icon={<CheckCircle className="h-4 w-4" />}
                trend="up"
                trendValue="5%"
              />
              <StatCard
                title="Next Class"
                value={todayClasses.length > 0 ? todayClasses[0].startTime : "N/A"}
                icon={<Clock className="h-4 w-4" />}
                description={todayClasses.length > 0 ? todayClasses[0].venue : "No classes today"}
              />
            </>
          ) : (
            <>
              <StatCard
                title="Attendance Rate"
                value={`${Math.round(studentOverallAttendance)}%`}
                icon={<CheckCircle className="h-4 w-4" />}
                trend={studentOverallAttendance > 80 ? "up" : "down"}
                trendValue={`${studentOverallAttendance > 80 ? "5%" : "3%"}`}
              />
              <StatCard
                title="Classes Today"
                value={todayClasses.length}
                icon={<Calendar className="h-4 w-4" />}
              />
              <StatCard
                title="Total Courses"
                value={courses.length}
                icon={<Users className="h-4 w-4" />}
              />
              <StatCard
                title="Next Class"
                value={todayClasses.length > 0 ? todayClasses[0].startTime : "N/A"}
                icon={<Clock className="h-4 w-4" />}
                description={todayClasses.length > 0 ? todayClasses[0].venue : "No classes today"}
              />
            </>
          )}
        </div>
        
        <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="col-span-2">
            <div className="grid gap-6">
              <div>
                <h2 className="text-lg font-semibold mb-4">
                  {todayClasses.length > 0 ? "Today's Classes" : "No Classes Today"}
                </h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {todayClasses.map((classSchedule) => (
                    <ClassCard key={classSchedule.id} classSchedule={classSchedule} />
                  ))}
                  
                  {todayClasses.length === 0 && (
                    <div className="col-span-full p-6 text-center bg-muted rounded-lg">
                      <p className="text-muted-foreground">No classes scheduled for today</p>
                    </div>
                  )}
                </div>
              </div>
              
              <UpcomingClasses />
            </div>
          </div>
          
          <div className="flex flex-col gap-6">
            <AttendanceChart 
              data={isLecturer ? lecturerAttendanceData : studentAttendanceData} 
            />
            
            {!isLecturer && <QrAttendance />}
          </div>
        </div>
      </div>
    </Layout>
  );
}
