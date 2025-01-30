// BookingsPage.jsx
import { Calendar } from "@/components/ui/calendar";
import axios from "axios";
import { useEffect, useState } from "react";
import BookingsList from "./BookingsList";
import { useAuth } from "../hooks/useAuth";
import BookingPopup from "./BookingPopup";

export default function BookingsPage() {
  const currentDateTime = new Date();
  const { authState } = useAuth();

  // Popup state
  const [popup, setPopup] = useState({
    isOpen: false,
    label: "",
    handleFunction: null,
  });

  // Bookings/availabilities
  const [date, setDate] = useState(null);
  const [error, setError] = useState("");
  const [bookings, setBookings] = useState([]);
  const [allAvailabilities, setAllAvailabilities] = useState([]);
  const [currentAvailabilities, setCurrentAvailabilities] = useState([]);

  // Define the sets used by the calendar for day highlighting
  const [availabilityDates, setAvailabilityDates] = useState(new Set());
  const [bookingDates, setBookingDates] = useState(new Set());

  // A SINGLE function to fetch appointments for date
  async function getAppointmentsForDate() {
    if (!date) return;
    setError("");

    try {
      let url = "";
      if (authState?.roles?.includes("Admin")) {
        // CAREGIVER => caretaker's own appointments
        url = `http://localhost:5148/api/appointment/user?id=${authState.userId}&date=${date}&isPatient=false`;
      } else {
        // PATIENT => fetch only that user's appointments
        url = `http://localhost:5148/api/appointment/user?id=${authState.userId}&date=${date}&isPatient=true`;
      }

      const { data } = await axios.get(url, { withCredentials: true });

      // Format dateTime to "YYYY-MM-DD HH:mm" in Swedish time
      const formattedData = data.map((item) => {
        const dateTimeSwedish = new Date(item.dateTime).toLocaleDateString(
          "sv-SE",
          {
            timeZone: "Europe/Stockholm",
            hour: "2-digit",
            minute: "2-digit",
          }
        );
        return {
          id: item.id,
          caregiverId: item.caregiverId,
          patientId: item.patientId,
          dateTime: dateTimeSwedish,
        };
      });

      setBookings(formattedData);
    } catch (err) {
      setError(err.response?.data || "Error fetching appointments");
      console.error("Error fetching appointments:", err);
    }
  }

  // Fetch ALL availabilities
  async function getAllAvailabilities() {
    try {
      const { data } = await axios.get(
        "http://localhost:5148/api/availability/all",
        {
          withCredentials: true,
        }
      );

      // Format each dateTime
      const formatted = data.map((item) => {
        const dateTimeSwedish = new Date(item.dateTime).toLocaleDateString(
          "sv-SE",
          {
            timeZone: "Europe/Stockholm",
            hour: "2-digit",
            minute: "2-digit",
          }
        );
        return {
          id: item.id,
          caregiverId: item.caregiverId,
          dateTime: dateTimeSwedish,
        };
      });
      setAllAvailabilities(formatted);
    } catch (err) {
      setError("Could not fetch availabilities");
      console.error("Error fetching all availabilities:", err);
    }
  }

  // Filter daily availabilities => selected date
  function filterAvailabilitiesForSelectedDate() {
    if (!date) return;
    const matched = allAvailabilities.filter((a) => {
      const localDate = new Date(a.dateTime).toLocaleDateString("sv-SE");
      return localDate === date;
    });
    setCurrentAvailabilities(matched);
  }

  //Create booking
  async function createBooking(patientId, caregiverId, dateTime) {
    setError("");
    // Check if in the past
    if (new Date(dateTime) < currentDateTime) {
      setError("Invalid date.");
      return false;
    }

    try {
      await axios.post(
        "http://localhost:5148/api/appointment",
        {
          PatientId: patientId,
          CaregiverId: caregiverId,
          Status: 1,
          DateTime: new Date(dateTime).toISOString(),
        },
        { withCredentials: true }
      );
      return true;
    } catch (err) {
      setError(err.response?.data || "Could not create booking");
      return false;
    }
  }

  // Cancel booking
  async function cancelBooking(appointmentId) {
    setError("");
    try {
      await axios.delete(
        `http://localhost:5148/api/appointment?id=${appointmentId}`,
        {
          withCredentials: true,
        }
      );
      return true;
    } catch (err) {
      setError(err.response?.data || "Could not cancel booking");
      return false;
    }
  }

  // On booking creation => refresh
  function onBookingCreated() {
    getAppointmentsForDate();
  }

  function onBookingUpdated() {
    // re-fetch so caretaker sees the new/canceled booking immediately
    getAppointmentsForDate();
    getAllAvailabilities();
    filterAvailabilitiesForSelectedDate();
  }

  //Calendar select
  function handleSetDate(selected) {
    if (!selected) return;
    const formatted = selected.toLocaleDateString("sv-SE");
    setDate(formatted);
  }

  // Generate main schedule
  function generateSchedule() {
    if (!date) return <h2>Select a date to see bookings</h2>;
    return (
      <BookingsList
        date={date}
        loggedInUser={authState}
        setPopup={setPopup}
        bookings={bookings}
        availabilites={currentAvailabilities}
        createBooking={createBooking}
        cancelBooking={cancelBooking}
        onBookingCreated={onBookingCreated}
        onBookingUpdated={onBookingUpdated}
      />
    );
  }

  // Build day sets for highlighting
  useEffect(() => {
    const availSet = new Set();
    allAvailabilities.forEach((a) => {
      const d = new Date(a.dateTime).toLocaleDateString("sv-SE");
      availSet.add(d);
    });

    const bookSet = new Set();
    bookings.forEach((b) => {
      const d = new Date(b.dateTime).toLocaleDateString("sv-SE");
      bookSet.add(d);
    });

    // If a day is in BOTH, remove it from availability => day shows as booking
    bookSet.forEach((ds) => {
      if (availSet.has(ds)) {
        availSet.delete(ds);
      }
    });

    setAvailabilityDates(availSet);
    setBookingDates(bookSet);
  }, [allAvailabilities, bookings]);

  // On mount => get all availabilities
  useEffect(() => {
    getAllAvailabilities();
  }, []);

  // Whenever date changes => fetch bookings & filter
  useEffect(() => {
    if (date) {
      getAppointmentsForDate();
      filterAvailabilitiesForSelectedDate();
    }
  }, [date]);

  // Return
  return (
    <div className="flex flex-col justify-center items-center">
      {error && <span className="text-red-500">{error}</span>}

      <Calendar
        timeZone="Europe/Stockholm"
        className="*:bg-white"
        mode="single"
        disabled={{ before: currentDateTime }}
        onSelect={handleSetDate}
        // Pass the sets for day highlighting
        availabilityDates={availabilityDates}
        bookingDates={bookingDates}
      />

      <div
        className={
          popup?.isOpen
            ? "-z-10 w-1/2 opacity-50 text-center"
            : "w-1/2 text-center"
        }
      >
        {generateSchedule()}
      </div>

      {popup?.isOpen && (
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
