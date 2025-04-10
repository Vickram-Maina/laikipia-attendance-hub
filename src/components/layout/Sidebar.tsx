
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import {
  BarChart2,
  Calendar,
  Home,
  QrCode,
  UserCheck,
  Users,
  BookOpen,
} from "lucide-react";

const studentNav = [
  { name: "Dashboard", icon: Home, href: "/" },
  { name: "Attendance", icon: UserCheck, href: "/attendance" },
  { name: "Classes", icon: Calendar, href: "/classes" },
  { name: "QR Scanner", icon: QrCode, href: "/scan" },
];

const lecturerNav = [
  { name: "Dashboard", icon: Home, href: "/" },
  { name: "Attendance", icon: UserCheck, href: "/attendance" },
  { name: "Classes", icon: Calendar, href: "/classes" },
  { name: "Courses", icon: BookOpen, href: "/courses" },
  { name: "Students", icon: Users, href: "/students" },
  { name: "Reports", icon: BarChart2, href: "/reports" },
];

export function Sidebar() {
  const { user } = useAuth();
  const location = useLocation();
  
  if (!user) return null;
  
  const navigation = user.role === "lecturer" ? lecturerNav : studentNav;
  
  return (
    <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 border-r bg-background pt-16 lg:block">
      <div className="space-y-4 py-4">
        <div className="px-4 py-2">
          <h2 className="text-lg font-semibold tracking-tight">
            {user.role === "lecturer" ? "Lecturer Portal" : "Student Portal"}
          </h2>
          <p className="text-sm text-muted-foreground">
            Manage your attendance and classes
          </p>
        </div>
        <nav className="space-y-1 px-2">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "group flex items-center rounded-md px-3 py-2 text-sm font-medium",
                location.pathname === item.href
                  ? "bg-laikipia-red text-white"
                  : "text-muted-foreground hover:bg-muted"
              )}
            >
              <item.icon
                className={cn(
                  "mr-3 h-5 w-5",
                  location.pathname === item.href
                    ? "text-white"
                    : "text-muted-foreground group-hover:text-foreground"
                )}
              />
              {item.name}
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  );
}
