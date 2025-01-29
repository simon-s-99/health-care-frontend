import { Calendar } from "@/components/ui/calendar";
import axios from "axios";
import { useEffect, useState } from "react";
import BookingsList from "./BookingsList";
import { useAuth } from "../hooks/useAuth";
import BookingPopup from "./BookingPopup";

export default function BookingsPage() {
  const currentDateTime = new Date();
  const { authState } = useAuth();

  const [popup, setPopup] = useState({
    isOpen: false,
    label: "",
    handleFunction: null,
  });
  const [date, setDate] = useState(null);
  const [error, setError] = useState("");
  const [bookings, setBookings] = useState([]);
  const [allAvailabilities, setAllAvailabilities] = useState([]);
  const [currentAvailabilities, setCurrentAvailabilities] = useState([]);

  // ============================================================
  // 1) A SINGLE function to fetch appointments depending on role
  // ============================================================
  async function getAppointmentsForDate() {
    if (!date) return;
    setError("");

    try {
      let url = "";
      if (authState?.roles?.includes("Admin")) {
        // CAREGIVER => fetch caretaker's own appointments
        url = `http://localhost:5148/api/appointment/user?id=${authState.userId}&date=${date}&isPatient=false`;
      } else {
        // PATIENT => fetch only that user's appointments
        url = `http://localhost:5148/api/appointment/user?id=${authState.userId}&date=${date}&isPatient=true`;
      }

      const { data } = await axios.get(url, { withCredentials: true });

      // Then format dateTime, etc.
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

  // ======================
  // 2) Fetch all availabilities
  // ======================
  async function getAllAvailabilities() {
    try {
      const { data } = await axios.get(
        "http://localhost:5148/api/availability/all",
        {
          withCredentials: true,
        }
      );
      // Format them to "YYYY-MM-DD HH:mm" in Swedish time
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

  // ======================
  // 3) Filter Availabilities => selected date
  // ======================
  function filterAvailabilitiesForSelectedDate() {
    if (!date) return;
    const matched = allAvailabilities.filter((a) => {
      const localDate = new Date(a.dateTime).toLocaleDateString("sv-SE");
      return localDate === date;
    });
    setCurrentAvailabilities(matched);
  }

  // ======================
  // 4) Create booking
  // ======================
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
      return true; // success
    } catch (err) {
      setError(err.response?.data || "Could not create booking");
      return false;
    }
  }

  // ======================
  // 5) Cancel booking
  // ======================
  async function cancelBooking(appointmentId) {
    setError("");
    try {
      await axios.delete(
        `http://localhost:5148/api/appointment?id=${appointmentId}`,
        { withCredentials: true }
      );
      return true;
    } catch (err) {
      setError(err.response?.data || "Could not cancel booking");
      return false;
    }
  }

  // ======================
  // 6) Called after booking creation => re-fetch
  // ======================
  function onBookingCreated() {
    // Re-fetch the new appointments => caretaker sees the booking
    getAppointmentsForDate();
  }

  // ======================
  // 7) handle calendar select
  // ======================
  function handleSetDate(selected) {
    if (!selected) return;
    const formatted = selected.toLocaleDateString("sv-SE");
    setDate(formatted);
  }

  // ======================
  // 8) Render schedule
  // ======================
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
        onBookingCreated={onBookingCreated} // pass callback
      />
    );
  }

  // ======================
  // 9) useEffects
  // ======================
  // On first mount => fetch all availabilities
  useEffect(() => {
    getAllAvailabilities();
  }, []);

  // Whenever date changes => fetch appointments & filter
  useEffect(() => {
    if (date) {
      getAppointmentsForDate();
      filterAvailabilitiesForSelectedDate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date]);

  // ======================
  // 10) Return UI
  // ======================
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
