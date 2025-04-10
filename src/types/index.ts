
export type UserRole = 'student' | 'lecturer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  profileImage?: string;
}

export interface CourseClass {
  id: string;
  courseCode: string;
  courseName: string;
  lecturerId: string;
  schedule: ClassSchedule[];
}

export interface ClassSchedule {
  id: string;
  courseId: string;
  date: string;
  startTime: string;
  endTime: string;
  venue: string;
  qrCode?: string;
}

export interface AttendanceRecord {
  id: string;
  classScheduleId: string;
  studentId: string;
  timestamp: string;
  status: 'present' | 'absent' | 'late';
  markedBy: 'student' | 'lecturer';
}

export interface DashboardStat {
  label: string;
  value: number | string;
  icon?: React.ReactNode;
}
