import { Calendar } from "@/components/ui/calendar";
import axios from "axios";
import { useEffect, useState } from "react";
import BookingsList from "./BookingsList";
import { useAuth } from "../../hooks/useAuth";
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
      return true; // Post succeeded
    } catch (e) {
      setError(e.response.data);
    }
  }

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
      setError(e.response.data);
    }
  }

  function handleSetDate(e) {
    const formattedDate = e.toLocaleDateString("sv-SE");
    setDate(formattedDate);
  }

  function generateSchedule() {
    let result;
    if (currentAvailabilites.length > 0 || (bookings.length > 0 && date)) {
      result = (
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
    } else if (date && firstAvailableSlot) {
      result = (
        <div>
          <h2 className="font-bold">No bookings for {date}</h2>
          <p>
            Next available time on{" "}
            {new Date(firstAvailableSlot.dateTime).toLocaleDateString("sv-SE")}
          </p>
        </div>
      );
    } else {
      result = <h2>Select a date to see bookings</h2>;
    }
    return result;
  }

  async function getUserAppointmentsForDate() {
    const { data } = await axios.get(
      `http://localhost:5148/api/appointment/user?id=${authState.userId}&isPatient=true&date=${date}`,
      {
        withCredentials: true,
      }
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

  async function getAllAvailabilites() {
    const { data } = await axios.get(
      "http://localhost:5148/api/availability/all"
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
        dateTime: dateTimeSwedish,
      };
      formattedData.push(entry);
    }
    setAllAvailabilites(formattedData);
  }

  function filterAvailabilitesForSelectedDate() {
    const allAvailabilitesCopy = allAvailabilites;
    const availabilitesForDate = allAvailabilitesCopy.filter(
      (a) =>
        new Date(a.dateTime).toLocaleDateString("sv-SE") ==
        new Date(date).toLocaleDateString("sv-SE")
    );
    setCurrentAvailabilites(availabilitesForDate);
  }

  // Get the first available time after the selected date
  function getFirstAvailability() {
    const allAvailabilitesCopy = allAvailabilites;
    const availability = allAvailabilitesCopy.filter(
      (a) =>
        new Date(a.dateTime).toLocaleDateString("sv-SE") >
        new Date(date).toLocaleDateString("sv-SE")
    )[0];

    setFirstAvailableSlot(availability);
  }

  useEffect(() => {
    if (date && authState.userId) {
      getUserAppointmentsForDate();
      filterAvailabilitesForSelectedDate();
      getFirstAvailability();
    }
  }, [date]);

  useEffect(() => {
    getAllAvailabilites();
  }, []);

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
