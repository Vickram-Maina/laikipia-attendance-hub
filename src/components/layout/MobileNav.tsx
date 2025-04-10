
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Link, useLocation } from "react-router-dom";
import {
  BarChart2,
  Calendar,
  Home,
  QrCode,
  UserCheck,
  Users,
  BookOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";

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

export function MobileNav() {
  const { user } = useAuth();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  
  if (!user) return null;
  
  const navigation = user.role === "lecturer" ? lecturerNav : studentNav;
  
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 lg:hidden"
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="pr-0 sm:max-w-xs">
        <div className="px-7">
          <Link
            to="/"
            className="flex items-center gap-2"
            onClick={() => setOpen(false)}
          >
            <div className="size-8 rounded bg-laikipia-red flex items-center justify-center text-white font-bold">
              LU
            </div>
            <span className="font-bold text-lg">Laikipia Attendance</span>
          </Link>
        </div>
        <div className="my-4 h-[calc(100vh-8rem)] pb-10 pl-6">
          <div className="flex flex-col space-y-3">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setOpen(false)}
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
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
