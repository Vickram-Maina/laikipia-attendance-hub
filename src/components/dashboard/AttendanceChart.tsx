
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface AttendanceChartProps {
  data: {
    present: number;
    absent: number;
    late: number;
  };
}

export function AttendanceChart({ data }: AttendanceChartProps) {
  const chartData = [
    { name: "Present", value: data.present, color: "#10b981" },
    { name: "Absent", value: data.absent, color: "#ef4444" },
    { name: "Late", value: data.late, color: "#f59e0b" },
  ];
  
  const totalClasses = data.present + data.absent + data.late;
  const attendanceRate = totalClasses > 0 
    ? Math.round((data.present / totalClasses) * 100) 
    : 0;
  
  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle className="text-lg">Attendance Summary</CardTitle>
        <CardDescription>Your overall attendance rate: {attendanceRate}%</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
