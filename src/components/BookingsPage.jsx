import { Calendar } from "@/components/ui/calendar";
import axios from "axios";
import { useEffect, useState } from "react";
import BookingsList from "./BookingsList";
import { useAuth } from "../hooks/useAuth";
import BookingPopup from "./BookingPopup";

export default function BookingsPage() {
  const currentDateTime = new Date(Date.now());
  const { authState } = useAuth();

  const [popup, setPopup] = useState({
    isOpen: false,
    label: "",
    handleFunction: null,
  });
  const [date, setDate] = useState(null);
  const [error, setError] = useState("");
  const [bookings, setBookings] = useState([]);
  const [availabilites, setAvailabilites] = useState([]);

  async function createBooking(patientId, caregiverId, dateTime) {
    setError("");

    // If date is in the past
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
      return true; // Post succeeded
    } catch (e) {
      setError(e.response.data);
    }
  }

  async function cancelBooking(appointmentId) {
    setError("");

    try {
      await axios.delete(
        `http://localhost:5148/api/appointment?id=${appointmentId}`
      );
      return true;
    } catch (e) {
      setError(e.response.data);
    }
  }

  function handleSetDate(e) {
    const formattedDate = e.toLocaleDateString("sv-SE");
    setDate(formattedDate);
  }

  function generateSchedule() {
    let result;

    if (availabilites.length > 0 || (bookings.length > 0 && date)) {
      result = (
        <BookingsList
          setPopup={setPopup}
          loggedInUser={authState}
          createBooking={createBooking}
          bookings={bookings}
          availabilites={availabilites}
          date={date}
          cancelBooking={cancelBooking}
        />
      );
    } else if (date) {
      result = <h2>No bookings for {date}</h2>;
    } else {
      result = <h2>Select a date to see bookings</h2>;
    }
    return result;
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

  async function getAvailabilitesForDate() {
    const { data } = await axios.get(
      `http://localhost:5148/api/availability/date?date=${date}`
    );

    const formattedData = [];
    for (let i = 0; i < data.length; i++) {
      const time = new Date(data[i].dateTime) // Get the time exclusively
        .toLocaleString("sv-SE")
        .split(" ")
        .pop()
        .slice(0, 5);

      const entry = {
        id: data[i].id,
        caregiverId: data[i].caregiverId,
        time: time,
      };

      formattedData.push(entry);
    }
    setAvailabilites(formattedData);
  }

  useEffect(() => {
    if (date && authState.userId) {
      getAvailabilitesForDate();
      getUserAppointmentsForDate();
    }
  }, [date]);

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
      <div
        className={
          popup && popup.isOpen
            ? "-z-10 w-1/2 opacity-50 text-center"
            : "w-1/2 text-center"
        }
      >
        {generateSchedule()}
      </div>
      {popup && popup.isOpen && (
        <BookingPopup
          isOpen={popup.isOpen}
          label={popup.label}
          handleFunction={popup.handleFunction}
          setPopup={setPopup}
        />
      )}
    </div>
  );
}
