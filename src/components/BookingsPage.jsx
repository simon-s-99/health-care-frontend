import { Calendar } from "@/components/ui/calendar";
import axios from "axios";
import { useEffect, useState } from "react";
import BookingsList from "./BookingsList";
import { useAuth } from "../hooks/useAuth";

export default function BookingsPage() {
  const currentDateTime = new Date(Date.now());

  const { authState } = useAuth();
  const [date, setDate] = useState(null);
  const [error, setError] = useState("");
  const [bookings, setBookings] = useState([]);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState("");

  async function book(patientId, caregiverId, dateTime) {
    setError("");

    if (new Date(dateTime) < currentDateTime) {
      setError("Invalid date.");
      return;
    }

    // Convert to UTC
    const utcDateTime = new Date(dateTime).toISOString();

    try {
      await axios.post("http://localhost:5148/api/appointment", {
        PatientId: patientId,
        CaregiverId: caregiverId,
        Status: 1,
        DateTime: utcDateTime,
      });
      setConfirmationMessage("Booked!");
    } catch (e) {
      setError(e.response.data);
    }
  }

  async function cancelBooking(appointmentId) {
    setError("");

    try {
      await axios.delete(`http://localhost:5148/api/appointment?id=${appointmentId}`);
      setConfirmationMessage("Booking canceled.");
    } catch (e) {
      setError(e.response.data);
    }
  }

  async function getUserAppointmentsForDate() {
    const { data } = await axios.get(
      `http://localhost:5148/api/appointment/user?id=${authState.userId}&isPatient=true&date=${date}`
    );
    const formattedData = [];
    for (let i = 0; i < data.length; i++) {
      const dateTimeSwedish = new Date(data[i].dateTime).toLocaleDateString(
        "sv-SE",
        {
          timeZone: "Europe/Stockholm",
          hour: "2-digit",
          minute: "2-digit",
        }
      );
      const entry = {
        id: data[i].id,
        caregiverId: data[i].caregiverId,
        patientId: data[i].patientId,
        dateTime: dateTimeSwedish,
      };
      formattedData.push(entry);
    }
    setBookings(formattedData);
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
        const time = new Date(data[i].availableSlots[j]) // Get the time exclusively
          .toLocaleString("sv-SE")
          .split(" ")
          .pop()
          .slice(0, 5);
        entry.availableSlots.push(time);
      }
      formattedData.push(entry);
    }
    setAvailableTimes(formattedData);
  }

  useEffect(() => {
    if (date && authState.userId) {
      setIsLoading(true);
      getAvailableTimesForDate();
      getUserAppointmentsForDate();
      setIsLoading(false);
    }
  }, [date, authState.userId]);

  function handleSetDate(e) {
    const formattedDate = e.toLocaleDateString("sv-SE");
    setDate(formattedDate);
  }

  function generateSchedule() {
    let result;

    if (isLoading) {
      result = <h2>Loading...</h2>;
    } else if (availableTimes.length > 0 || (bookings.length > 0 && date)) {
      result = (
        <BookingsList
          book={book}
          bookings={bookings}
          availableTimes={availableTimes}
          date={date}
          confirmationMessage={confirmationMessage}
          cancelBooking={cancelBooking}
          setConfirmationMessage={setConfirmationMessage}
        />
      );
    } else if (date) {
      result = <h2>No bookings for {date}</h2>;
    } else {
      result = <h2>Select a date to see bookings</h2>;
    }
    return result;
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

      {generateSchedule()}
    </div>
  );
}
