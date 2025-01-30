import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import axios from "axios";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"


export default function Dashboard() {
  const { authState } = useAuth();
  const isAdmin = authState && authState.roles?.includes("Admin");
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [appointmentHistory, setAppointmentHistory] = useState([]);
  const [userNames, setUserNames] = useState({}); // Stores names of doctors (for users) or patients (for admins)

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get("http://localhost:5148/api/appointment/user", {
          params: { id: authState.userId, isPatient: !isAdmin },
          withCredentials: true,
        });

        if (response.data) {
          const now = new Date(Date.now());

          const upcoming = response.data.filter(
            (appointment) => new Date(appointment.dateTime) >= now
          );
          const history = response.data.filter(
            (appointment) => new Date(appointment.dateTime) < now
          );

          setUpcomingAppointments(upcoming);
          setAppointmentHistory(history);

          // Fetch user names (doctors for users, patients for admins)
          const userIds = [
            ...new Set([
              ...upcoming.map((appointment) => isAdmin ? appointment.patientId : appointment.caregiverId),
              ...history.map((appointment) => isAdmin ? appointment.patientId : appointment.caregiverId),
            ]),
          ];

          userIds.forEach(async (userId) => {
            try {
              const { data } = await axios.get(`http://localhost:5148/api/user?id=${userId}`);
              setUserNames((prevNames) => ({
                ...prevNames,
                [userId]: `${data.firstname} ${data.lastname}`,
                withCredentials: true,
              }));
            } catch (error) {
              console.error("Error fetching user data:", error);
            }
          });
        }
      } catch (error) {
        console.error("Failed to fetch appointments:", error);
      }
    };

    fetchAppointments();
  }, [authState.userId, isAdmin]);

  const onCancelAppointment = async (appointmentId) => {
    try {
      await axios.delete(`http://localhost:5148/api/appointment`, {
        params: { id: appointmentId },
        withCredentials: true,
      });
      setUpcomingAppointments((prev) =>
        prev.filter((a) => a.id !== appointmentId)
      );
    } catch (error) {
      console.error("Error canceling appointment:", error);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <Tabs defaultValue="upcoming">
          <nav className="text-center">
            <TabsList className="gap-x-2">
              <TabsTrigger value="upcoming">
                Upcoming Appointments
              </TabsTrigger>
              <TabsTrigger value="history">
                Appointment History
              </TabsTrigger>
            </TabsList>
          </nav>

          {/* Upcoming Appointments */}
          <TabsContent value="upcoming">
            <h2 className="text-xl font-bold text-center mt-4 mb-6">
              Upcoming Appointments
            </h2>
            {upcomingAppointments.length > 0 ? (
              <Carousel orientation="horizontal">
                <CarouselContent>
                  {upcomingAppointments.map((appointment) => (
                    <CarouselItem
                      key={appointment.id}
                      className="md:basis-1/3 lg:basis-1/4">
                      <Card
                        className="rounded-2xl bg-white mb-1"
                      >
                        <CardHeader className="text-center">
                          <CardTitle className="text-lg font-semibold">
                            {new Date(appointment.dateTime).toLocaleDateString()}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="text-center">
                          <p className="text-sm text-gray-600">
                            Time: {new Date(appointment.dateTime).toLocaleTimeString("sv-SE", {
                              timeZone: "Europe/Stockholm",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                          <p className="text-sm text-gray-600 text-wrap">
                            {isAdmin ? "Patient" : "Doctor"}: {userNames[isAdmin ? appointment.patientId : appointment.caregiverId]}
                          </p>
                          <button
                            onClick={() => onCancelAppointment(appointment.id)}
                            className="mt-4 text-red-600 font-semibold hover:underline"
                          >
                            Cancel
                          </button>
                        </CardContent>
                      </Card>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            ) : (
              <p className="text-center text-gray-500 italic">
                No upcoming appointments scheduled.
              </p>
            )}
          </TabsContent>

          {/* Appointment History */}
          <TabsContent value="history">
            <h2 className="text-xl font-bold text-center mt-4 mb-6">
              Appointment History
            </h2>
            {appointmentHistory.length > 0 ? (
              <div className="">
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
                      <p className="text-sm text-gray-600">
                        Time: {new Date(appointment.dateTime).toLocaleTimeString("sv-SE", {
                          timeZone: "Europe/Stockholm",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                      <p className="text-sm text-gray-600">
                        {isAdmin ? "Patient" : "Doctor"}: {userNames[isAdmin ? appointment.patientId : appointment.caregiverId]}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 italic">
                No past appointments found.
              </p>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
