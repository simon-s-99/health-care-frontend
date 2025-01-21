import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";

export default function UserDashboard() {
  const {
    authState: { username },
  } = useAuth();

  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [appointmentHistory, setAppointmentHistory] = useState([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      const mockUpcoming = [
        { id: 1, date: "2025-01-23", time: "10:00 AM", doctor: "Dr. Smith" },
        { id: 2, date: "2025-01-25", time: "2:00 PM", doctor: "Dr. Johnson" },
        { id: 3, date: "2025-01-25", time: "2:00 PM", doctor: "Dr. Johnson" },
        { id: 4, date: "2025-01-25", time: "2:00 PM", doctor: "Dr. Johnson" },
        { id: 5, date: "2025-01-25", time: "2:00 PM", doctor: "Dr. Johnson" },
      ];
      const mockHistory = [
        { id: 1, date: "2024-12-20", time: "3:00 PM", doctor: "Dr. Adams" },
      ];
      setUpcomingAppointments(mockUpcoming);
      setAppointmentHistory(mockHistory);
    };

    fetchAppointments();
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">

        <Tabs defaultValue="upcoming" className="text-gray-800">
        <TabsList className="flex mb-6 gap-6">
            <TabsTrigger
              value="upcoming"
              className="px-8 py-2 rounded-xl text-sm font-semibold bg-gray-100 hover:bg-indigo-100 transition-all"
            >
              Upcoming Appointments
            </TabsTrigger>
            <TabsTrigger
              value="history"
              className="px-8 py-2 rounded-xl text-sm font-semibold bg-gray-100 hover:bg-indigo-100 transition-all"
            >
              Appointment History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming">
            <h2 className="text-xl font-bold text-gray-700 mb-4">Upcoming Appointments</h2>
            {upcomingAppointments.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2">
                {upcomingAppointments.map((appointment) => (
                  <Card key={appointment.id} className="shadow hover:shadow-md transition">
                    <CardHeader>
                      <CardTitle className="text-lg font-bold text-gray-800">
                        {appointment.date}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600">Time: {appointment.time}</p>
                      <p className="text-sm text-gray-600">Doctor: {appointment.doctor}</p>
                      <button className="text-indigo-600 text-sm font-semibold hover:underline mt-2">
                        Reschedule
                      </button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No upcoming appointments.</p>
            )}
          </TabsContent>

          <TabsContent value="history">
            <h2 className="text-xl font-bold text-gray-700 mb-4">Appointment History</h2>
            {appointmentHistory.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2">
                {appointmentHistory.map((appointment) => (
                  <Card key={appointment.id} className="shadow hover:shadow-md transition">
                    <CardHeader>
                      <CardTitle className="text-lg font-bold text-gray-800">
                        {appointment.date}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600">Time: {appointment.time}</p>
                      <p className="text-sm text-gray-600">Doctor: {appointment.doctor}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No past appointments found.</p>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
