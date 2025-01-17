import { Calendar } from "@/components/ui/calendar";
import axios from "axios";
import { useEffect, useState } from "react";
import BookingsList from "./BookingsList";
import { useAuth } from "../hooks/useAuth";

export default function BookingsPage() {
  const currentDateTime = new Date(Date.now());

  const {
    authState: { user },
  } = useAuth();
  const isAdmin = user && user.roles.includes("Admin");

  const [date, setDate] = useState(null);
  const [error, setError] = useState("");
  const [bookings, setBookings] = useState([]);
  const [availableTimes, setAvailableTimes] = useState([]);

  async function book(patientId, caregiverId, dateTime) {
    setError("");

    if (new Date(dateTime) < currentDateTime) {
      setError("Invalid date.");
      return;
    }

    try {
      await axios.post("http://localhost:5148/api/appointment", {
        PatientId: patientId,
        CaregiverId: caregiverId,
        Status: 1,
        DateTime: dateTime,
      });
    } catch (e) {
      setError(e.response.data);
    }
  }

  async function getUserAppointmentsForDate() {
    const { data } = await axios.get(
      `http://localhost:5148/api/appointment/user?id=${"6787c0bdac13847d0e917f7b"}&isPatient=true&date=${date}`
    );
    console.log(data)
    setBookings(data);
  }

  async function getAvailableTimesForDate() {
    const { data } = await axios.get(
      `http://localhost:5148/api/availability/date?date=${date}`
    );

    const formattedData = [];
    for (let i = 0; i < data.length; i++) {
      const entry = {
        id: data[i].id,
        caregiverId: data[i].caregiverId,
        availableSlots: [],
      };
      for (let j = 0; j < data[0].availableSlots.length; j++) {
        const time = new Date(data[i].availableSlots[j])
          .toLocaleString("sv-SE")
          .split(" ")
          .pop().slice(0, 5);
        entry.availableSlots.push(time);
      }
      formattedData.push(entry)
    }
    setAvailableTimes(formattedData);
  }


  useEffect(() => {
    if (date) {
      getAvailableTimesForDate();
      getUserAppointmentsForDate();
    }
  }, [date]);

  function handleSetDate(e) {
    const formattedDate = e.toLocaleDateString("sv-SE");
    setDate(formattedDate);
  }
  return (
    <div className="flex flex-col justify-center items-center">
      {error && <span className="text-red-500">{error}</span>}
      <Calendar
        timeZone="Europe/Stockholm"
        className="*:bg-white"
        mode="single"
        disabled={{ before: currentDateTime }}
        onSelect={handleSetDate}
      />
      {availableTimes.length > 0 || bookings.length > 0 && date ? (
        <BookingsList
        book={book}
          bookings={bookings}
          availableTimes={availableTimes}
          isAdmin={isAdmin}
          date={date}
        />
      ) : (
        <h2>No available times for {date}</h2>
      )}
    </div>
  );
}
