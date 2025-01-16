import { Calendar } from "@/components/ui/calendar";
import axios from "axios";
import { useEffect, useState } from "react";
import BookingsList from "./BookingsList";
import { useAuth } from "../hooks/useAuth";

export default function BookingsPage() {
  const currentDateTime = new Date(Date.now());
  const currentTime = currentDateTime.toLocaleTimeString("sv-SE").slice(0, 5);

  const {
    authState: { user },
  } = useAuth();
  const isAdmin = user && user.roles.includes("Admin");

  const [time, setTime] = useState(currentTime);
  const [date, setDate] = useState(new Date());
  const [error, setError] = useState("");
  const [bookings, setBookings] = useState([]);

  async function handleSubmit(e) {
    e.preventDefault();

    setError("");

    const patientId = "6787c0bdac13847d0e917f7b";
    const caregiverId = "6787d1ac02047fbc901e65fd";
    const status = 1;
    const dateCopy = date;
    dateCopy.setHours(parseInt(time.slice(0, 2)));
    dateCopy.setMinutes(parseInt(time.slice(3)));
    setDate(dateCopy);

    if (date < currentDateTime) {
      setError("Invalid date.");
      return;
    }

    try {
      await axios.post("http://localhost:5148/api/appointment", {
        PatientId: patientId,
        CaregiverId: caregiverId,
        Status: status,
        DateTime: date,
      });

    } catch(e) {
      setError(e.response.data)
    }
  }
  async function getUserAppointments() {
    const { data } = await axios.get(
      `http://localhost:5148/api/appointment/user?id=${"6787c0bdac13847d0e917f7b"}&isPatient=true`
    );
    setBookings(data);
  }

  useEffect(() => {
    getUserAppointments();
  }, []);

  return (
    <div className="flex flex-col justify-center items-center">
      {error && <span className="text-red-500">{error}</span>}
      <form onSubmit={handleSubmit}>
        <label className="inline-flex gap-2 ">
          Time
          <input
            className="border-[1px] border-black"
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
        </label>
        <button type="submit">Submit</button>
        <Calendar
          mode="single"
          disabled={{ before: currentDateTime }}
          selected={date}
          onSelect={setDate}
        />
        <BookingsList bookings={bookings} isAdmin={isAdmin} />
      </form>
    </div>
  );
}
