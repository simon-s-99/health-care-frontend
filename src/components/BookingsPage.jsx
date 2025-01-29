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
  const [allAvailabilites, setAllAvailabilites] = useState([]);
  const [currentAvailabilites, setCurrentAvailabilites] = useState([]);
  const [firstAvailableSlot, setFirstAvailableSlot] = useState(null);

  // -----------------------
  // 1) Create a booking
  // -----------------------
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
      await axios.post(
        "http://localhost:5148/api/appointment",
        {
          PatientId: patientId,
          CaregiverId: caregiverId,
          Status: 1,
          DateTime: utcDateTime,
        },
        { withCredentials: true }
      );
      // Optionally refresh bookings if needed
      return true; // Post succeeded
    } catch (e) {
      setError(e?.response?.data || "Could not create booking");
    }
  }

  // -----------------------
  // 2) Cancel a booking
  // -----------------------
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
    } catch (e) {
      setError(e?.response?.data || "Could not cancel booking");
    }
  }

  // -----------------------
  // 3) Handle calendar date select
  // -----------------------
  function handleSetDate(selectedDate) {
    if (!selectedDate) return;
    const formattedDate = selectedDate.toLocaleDateString("sv-SE");
    setDate(formattedDate);
  }

  // -----------------------
  // 4) Generate UI for main section
  // -----------------------
  function generateSchedule() {
    if (!date) {
      return <h2>Select a date to see bookings</h2>;
    }
    return (
      <BookingsList
        setPopup={setPopup}
        loggedInUser={authState}
        createBooking={createBooking}
        bookings={bookings}
        availabilites={currentAvailabilites}
        date={date}
        cancelBooking={cancelBooking}
      />
    );
  }

  // -----------------------
  // 5) Fetch user's booked appointments for the date
  // -----------------------
  async function getUserAppointmentsForDate() {
    if (!authState?.userId || !date) return;

    try {
      const { data } = await axios.get(
        `http://localhost:5148/api/appointment/user?id=${authState.userId}&isPatient=true&date=${date}`,
        { withCredentials: true }
      );

      // Convert dateTime => "YYYY-MM-DD HH:mm" in your local logic
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
      console.error("Error fetching user appointments:", err);
    }
  }

  // -----------------------
  // 6) Fetch ALL availabilities
  // -----------------------
  async function getAllAvailabilites() {
    try {
      const { data } = await axios.get(
        "http://localhost:5148/api/availability/all"
      );
      // Format them similarly
      const formatted = data.map((item) => {
        // Convert to "YYYY-MM-DD HH:mm" in Swedish time
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
      setAllAvailabilites(formatted);
    } catch (err) {
      console.error("Error fetching all availabilities:", err);
    }
  }

  // -----------------------
  // 7) Filter to only the selected date
  // -----------------------
  function filterAvailabilitesForSelectedDate() {
    if (!date) return;
    const availabilitiesForDate = allAvailabilites.filter((a) => {
      const aDate = new Date(a.dateTime).toLocaleDateString("sv-SE");
      return aDate === date;
    });
    setCurrentAvailabilites(availabilitiesForDate);
  }

  // -----------------------
  // 8) Find the first availability *after* the chosen date
  // (Optional logic for next available slot)
  // -----------------------
  function getFirstAvailability() {
    if (!date) return;
    const next = allAvailabilites.find(
      (a) =>
        new Date(a.dateTime).toLocaleDateString("sv-SE") >
        new Date(date).toLocaleDateString("sv-SE")
    );
    setFirstAvailableSlot(next || null);
  }

  // -----------------------
  // 9) Whenever date changes, fetch relevant data
  // -----------------------
  useEffect(() => {
    if (date && authState.userId) {
      getUserAppointmentsForDate();
      filterAvailabilitesForSelectedDate();
      getFirstAvailability();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date]);

  // -----------------------
  // 10) On first mount, get all availabilities
  // -----------------------
  useEffect(() => {
    getAllAvailabilites();
  }, []);

  // -----------------------
  // 11) RENDER
  // -----------------------
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
