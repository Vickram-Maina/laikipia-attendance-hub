
import { ClassCard } from "./ClassCard";
import { getUpcomingClasses } from "@/lib/mock-data";

export function UpcomingClasses() {
  const upcomingClasses = getUpcomingClasses();
  
  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Upcoming Classes</h2>
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2">
        {upcomingClasses.map((classSchedule) => (
          <ClassCard key={classSchedule.id} classSchedule={classSchedule} />
        ))}
        
        {upcomingClasses.length === 0 && (
          <div className="col-span-full p-6 text-center">
            <p className="text-muted-foreground">No upcoming classes scheduled</p>
          </div>
        )}
      </div>
    </div>
  );
}
