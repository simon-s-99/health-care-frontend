import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import axios from "axios";

export default function UserDashboard() {
  const { authState } = useAuth();
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [appointmentHistory, setAppointmentHistory] = useState([]);
  const [caregiverNames, setCaregiverNames] = useState({}); 

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get("http://localhost:5148/api/appointment/user", {
          params: { id: authState.userId, isPatient: true },
        });

        if (response.data) {
          const now = new Date();

          const upcoming = response.data.filter(
            (appointment) => new Date(appointment.dateTime) >= now
          );

          const history = response.data.filter(
            (appointment) => new Date(appointment.dateTime) < now
          );

          setUpcomingAppointments(upcoming);
          setAppointmentHistory(history);

          // Fetch caregivers' names
          const caregiverIds = [
            ...new Set([
              ...upcoming.map((appointment) => appointment.caregiverId),
              ...history.map((appointment) => appointment.caregiverId),
            ]),
          ];

          caregiverIds.forEach(async (caregiverId) => {
            try {
              const { data } = await axios.get(`http://localhost:5148/api/user?id=${caregiverId}`);
              setCaregiverNames((prevNames) => ({
                ...prevNames,
                [caregiverId]: `${data.firstname} ${data.lastname}`,
              }));
            } catch (error) {
              console.error("Error fetching caregiver data:", error);
            }
          });
        }
      } catch (error) {
        console.error("Failed to fetch appointments:", error);
      }
    };

    fetchAppointments();
  }, [authState.userId]);

  const onCancelAppointment = async (appointmentId) => {
    try {
      await axios.delete(`http://localhost:5148/api/appointment`, {
        params: { id: appointmentId },
      });
      setUpcomingAppointments((prev) => prev.filter((a) => a.id !== appointmentId));
    } catch (error) {
      console.error("Error canceling appointment:", error);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <Tabs defaultValue="upcoming" className="text-gray-800">
          <TabsList className="flex mb-6 gap-6 justify-center">
            <TabsTrigger
              value="upcoming"
              className="px-8 py-2 rounded-xl text-sm font-semibold bg-gray-100 hover:bg-indigo-200 transition-all"
            >
              Upcoming Appointments
            </TabsTrigger>
            <TabsTrigger
              value="history"
              className="px-8 py-2 rounded-xl text-sm font-semibold bg-gray-100 hover:bg-indigo-200 transition-all"
            >
              Appointment History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming">
            <h2 className="text-xl font-bold text-gray-700 mb-4">Upcoming Appointments</h2>
            {upcomingAppointments.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
                {upcomingAppointments.map((appointment) => (
                  <Card
                    key={appointment.id}
                    className="shadow-lg hover:shadow-xl transition-all border rounded-2xl p-4 max-w-sm mx-auto bg-white"
                  >
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold text-gray-800">
                        {new Date(appointment.dateTime).toLocaleDateString()}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600">
                        Time: {new Date(appointment.dateTime).toLocaleTimeString('sv-SE', { 
                          timeZone: 'UTC',
                          hour: "2-digit",
                          minute: "2-digit" 
                        })}
                      </p>
                      <p className="text-sm text-gray-600">Doctor: {caregiverNames[appointment.caregiverId]}
                      </p>
                      <button
                      onClick={() => onCancelAppointment(appointment.id)} 
                      className="mt-4 text-red-600 font-semibold hover:underline">
                        Cancel
                      </button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 italic">No upcoming appointments scheduled.</p>
            )}
          </TabsContent>

          <TabsContent value="history">
            <h2 className="text-xl font-bold text-gray-700 mb-4">Appointment History</h2>
            {appointmentHistory.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
                {appointmentHistory.map((appointment) => (
                  <Card
                    key={appointment.id}
                    className="shadow-lg hover:shadow-xl transition-all border rounded-2xl p-4 max-w-sm mx-auto bg-white"
                  >
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold text-gray-800">
                        {new Date(appointment.dateTime).toLocaleDateString()}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600">Time: {new Date(appointment.dateTime).toLocaleTimeString()}</p>
                      <p className="text-sm text-gray-600">Doctor: {caregiverNames[appointment.caregiverId]}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 italic">No past appointments found.</p>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
