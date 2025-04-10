
import { User, CourseClass, ClassSchedule, AttendanceRecord } from "@/types";

// Mock Users
export const users: User[] = [
  {
    id: "l001",
    name: "Dr. Jane Smith",
    email: "jsmith@laikipia.ac.ke",
    role: "lecturer",
    profileImage: "/placeholder.svg"
  },
  {
    id: "l002",
    name: "Prof. John Doe",
    email: "jdoe@laikipia.ac.ke",
    role: "lecturer",
    profileImage: "/placeholder.svg"
  },
  {
    id: "s001",
    name: "Alice Wanjiku",
    email: "awanjiku@students.laikipia.ac.ke",
    role: "student",
    profileImage: "/placeholder.svg"
  },
  {
    id: "s002",
    name: "Bob Kamau",
    email: "bkamau@students.laikipia.ac.ke",
    role: "student",
    profileImage: "/placeholder.svg"
  },
  {
    id: "s003",
    name: "Carol Muthoni",
    email: "cmuthoni@students.laikipia.ac.ke",
    role: "student",
    profileImage: "/placeholder.svg"
  }
];

// Mock Courses and Classes
export const courses: CourseClass[] = [
  {
    id: "c001",
    courseCode: "CS101",
    courseName: "Introduction to Computer Science",
    lecturerId: "l001",
    schedule: []
  },
  {
    id: "c002",
    courseCode: "CS201",
    courseName: "Data Structures and Algorithms",
    lecturerId: "l001",
    schedule: []
  },
  {
    id: "c003",
    courseCode: "MATH101",
    courseName: "Calculus I",
    lecturerId: "l002",
    schedule: []
  }
];

// Generate class schedules for the next 30 days
export const generateClassSchedules = (): ClassSchedule[] => {
  const schedules: ClassSchedule[] = [];
  const today = new Date();
  
  // For each course, create 2 classes per week for the next 4 weeks
  courses.forEach(course => {
    for (let week = 0; week < 4; week++) {
      // Monday class
      const mondayDate = new Date(today);
      mondayDate.setDate(today.getDate() + (week * 7) + (1 - today.getDay()));
      
      // Thursday class
      const thursdayDate = new Date(today);
      thursdayDate.setDate(today.getDate() + (week * 7) + (4 - today.getDay()));
      
      const mondaySchedule: ClassSchedule = {
        id: `sch-${course.id}-mon-${week}`,
        courseId: course.id,
        date: mondayDate.toISOString().split('T')[0],
        startTime: "09:00",
        endTime: "11:00",
        venue: `Room ${(Math.floor(Math.random() * 10) + 1)}01`,
        qrCode: `qr-${course.id}-mon-${week}`
      };
      
      const thursdaySchedule: ClassSchedule = {
        id: `sch-${course.id}-thu-${week}`,
        courseId: course.id,
        date: thursdayDate.toISOString().split('T')[0],
        startTime: "14:00",
        endTime: "16:00",
        venue: `Room ${(Math.floor(Math.random() * 10) + 1)}01`,
        qrCode: `qr-${course.id}-thu-${week}`
      };
      
      schedules.push(mondaySchedule, thursdaySchedule);
      
      // Add these schedules to the course
      const courseIndex = courses.findIndex(c => c.id === course.id);
      if (courseIndex >= 0) {
        courses[courseIndex].schedule.push(mondaySchedule, thursdaySchedule);
      }
    }
  });
  
  return schedules;
};

// Generate the class schedules
export const classSchedules = generateClassSchedules();

// Mock Attendance Records
export const attendanceRecords: AttendanceRecord[] = [
  // Let's create some sample attendance records
  {
    id: "att001",
    classScheduleId: classSchedules[0].id,
    studentId: "s001",
    timestamp: new Date().toISOString(),
    status: "present",
    markedBy: "student"
  },
  {
    id: "att002",
    classScheduleId: classSchedules[0].id,
    studentId: "s002",
    timestamp: new Date().toISOString(),
    status: "present",
    markedBy: "student"
  },
  {
    id: "att003",
    classScheduleId: classSchedules[0].id,
    studentId: "s003",
    timestamp: new Date().toISOString(),
    status: "absent",
    markedBy: "lecturer"
  },
  {
    id: "att004",
    classScheduleId: classSchedules[1].id,
    studentId: "s001",
    timestamp: new Date().toISOString(),
    status: "late",
    markedBy: "lecturer"
  },
  {
    id: "att005",
    classScheduleId: classSchedules[1].id,
    studentId: "s002",
    timestamp: new Date().toISOString(),
    status: "present",
    markedBy: "student"
  }
];

// Utility function to get today's class schedules
export const getTodayClasses = (): ClassSchedule[] => {
  const today = new Date().toISOString().split('T')[0];
  return classSchedules.filter(schedule => schedule.date === today);
};

// Utility function to get upcoming classes
export const getUpcomingClasses = (): ClassSchedule[] => {
  const today = new Date().toISOString().split('T')[0];
  return classSchedules.filter(schedule => schedule.date > today)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5);
};

// Utility function to get a course by ID
export const getCourseById = (id: string): CourseClass | undefined => {
  return courses.find(course => course.id === id);
};

// Utility function to get a class schedule by ID
export const getClassScheduleById = (id: string): ClassSchedule | undefined => {
  return classSchedules.find(schedule => schedule.id === id);
};

// Utility function to get attendance for a specific class
export const getAttendanceForClass = (classScheduleId: string): AttendanceRecord[] => {
  return attendanceRecords.filter(record => record.classScheduleId === classScheduleId);
};

// Utility function to get attendance records for a student
export const getAttendanceForStudent = (studentId: string): AttendanceRecord[] => {
  return attendanceRecords.filter(record => record.studentId === studentId);
};

// Utility function to calculate attendance percentage for a student in a course
export const getStudentCourseAttendance = (studentId: string, courseId: string): number => {
  const courseSchedules = classSchedules.filter(schedule => schedule.courseId === courseId);
  const studentAttendance = attendanceRecords.filter(
    record => 
      record.studentId === studentId && 
      courseSchedules.some(schedule => schedule.id === record.classScheduleId)
  );
  
  const presentCount = studentAttendance.filter(record => record.status === "present").length;
  return courseSchedules.length > 0 ? (presentCount / courseSchedules.length) * 100 : 0;
};

// Mock authentication function
export const authenticateUser = (email: string, password: string): User | null => {
  // In a real app, you'd verify credentials against a database
  // For this demo, we'll just check if the email exists in our mock data
  // and assume any password works
  const user = users.find(u => u.email === email);
  return user || null;
};
