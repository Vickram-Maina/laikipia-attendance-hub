
import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { ClassCard } from "@/components/dashboard/ClassCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { classSchedules, courses, getCourseById } from "@/lib/mock-data";
import { useAuth } from "@/contexts/AuthContext";
import { ClassSchedule } from "@/types";
import { Calendar, Search } from "lucide-react";
import { format, parseISO } from "date-fns";

export default function Classes() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");

  const isLecturer = user?.role === "lecturer";

  // Filter class schedules based on date relative to today
  const today = new Date().toISOString().split("T")[0];
  const upcomingClasses = classSchedules.filter(
    (schedule) => schedule.date >= today
  );
  const pastClasses = classSchedules.filter(
    (schedule) => schedule.date < today
  );

  // Filter based on search term
  const filteredUpcoming = upcomingClasses.filter((schedule) => {
    const course = getCourseById(schedule.courseId);
    return (
      course?.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course?.courseCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      schedule.venue.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const filteredPast = pastClasses.filter((schedule) => {
    const course = getCourseById(schedule.courseId);
    return (
      course?.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course?.courseCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      schedule.venue.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Group classes by date for better organization
  const groupClassesByDate = (
    classes: ClassSchedule[]
  ): { date: string; classes: ClassSchedule[] }[] => {
    const groupedClasses: { [key: string]: ClassSchedule[] } = {};

    classes.forEach((classSchedule) => {
      if (!groupedClasses[classSchedule.date]) {
        groupedClasses[classSchedule.date] = [];
      }
      groupedClasses[classSchedule.date].push(classSchedule);
    });

    return Object.entries(groupedClasses)
      .map(([date, classes]) => ({ date, classes }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  const upcomingGroupedClasses = groupClassesByDate(filteredUpcoming);
  const pastGroupedClasses = groupClassesByDate(filteredPast);

  return (
    <Layout>
      <div className="mt-6 lg:mt-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Class Schedule</h1>
            <p className="text-muted-foreground">
              View and manage your class schedules
            </p>
          </div>

          {isLecturer && (
            <Button className="bg-laikipia-red hover:bg-rose-600">
              Create New Class
            </Button>
          )}
        </div>

        <div className="mt-6">
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search classes by name, code, or venue..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Tabs defaultValue="upcoming" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="upcoming">Upcoming Classes</TabsTrigger>
              <TabsTrigger value="past">Past Classes</TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming">
              {upcomingGroupedClasses.length > 0 ? (
                <div className="space-y-8">
                  {upcomingGroupedClasses.map((group) => (
                    <div key={group.date}>
                      <div className="flex items-center gap-2 mb-4">
                        <Calendar className="h-5 w-5 text-laikipia-red" />
                        <h2 className="text-lg font-medium">
                          {format(parseISO(group.date), "EEEE, MMMM d, yyyy")}
                        </h2>
                      </div>
                      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {group.classes.map((classSchedule) => (
                          <ClassCard
                            key={classSchedule.id}
                            classSchedule={classSchedule}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-muted rounded-lg">
                  <p className="text-muted-foreground">
                    {searchTerm
                      ? "No upcoming classes match your search"
                      : "No upcoming classes scheduled"}
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="past">
              {pastGroupedClasses.length > 0 ? (
                <div className="space-y-8">
                  {pastGroupedClasses.map((group) => (
                    <div key={group.date}>
                      <div className="flex items-center gap-2 mb-4">
                        <Calendar className="h-5 w-5 text-muted-foreground" />
                        <h2 className="text-lg font-medium">
                          {format(parseISO(group.date), "EEEE, MMMM d, yyyy")}
                        </h2>
                      </div>
                      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {group.classes.map((classSchedule) => (
                          <ClassCard
                            key={classSchedule.id}
                            classSchedule={classSchedule}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-muted rounded-lg">
                  <p className="text-muted-foreground">
                    {searchTerm
                      ? "No past classes match your search"
                      : "No past classes found"}
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
}
