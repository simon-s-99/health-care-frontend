import axios from "axios";
import { useEffect, useState } from "react";

export default function BookingSlot({
  loggedInUser,
  isAvailable,
  date,
  time,
  availability,
  setPopup,
  createBooking,
}) {
  const [caregiver, setCaregiver] = useState(null);
  const isCaregiver = loggedInUser?.roles?.includes("Admin");

  // CREATE
  async function handleCreateAvailability() {
    setPopup(null);
    try {
      const dateTimeStr = availability?.dateTime
        ? availability.dateTime
        : `${date}T${time}:00`;
      const utcDateTime = new Date(dateTimeStr).toISOString();

      await axios.post(
        "http://localhost:5148/api/availability",
        {
          CaregiverId: loggedInUser.userId,
          DateTime: utcDateTime,
        },
        { withCredentials: true }
      );
    } catch (err) {
      console.error("Failed to create availability:", err);
    }
  }

  // REMOVE
  async function handleRemoveAvailability() {
    setPopup(null);
    try {
      await axios.delete(
        `http://localhost:5148/api/availability?id=${availability?.id}`,
        { withCredentials: true }
      );
    } catch (err) {
      console.error("Failed to remove availability:", err);
    }
  }

  // BOOK
  function handleCreateBooking() {
    setPopup(null);

    const dateTime =
      date +
      "T" +
      new Date(availability.dateTime).toLocaleTimeString("sv-SE", {
        hour: "2-digit",
        minute: "2-digit",
      });
    const success = createBooking(
      loggedInUser.userId,
      availability.caregiverId,
      dateTime
    );
    if (success) {
      if (onBookingUpdated) {
        onBookingUpdated();
        getAllAvailabilities();
      }
    }
  }

  // Fetch caretaker name if needed
  async function fetchCaregiver() {
    if (!availability?.caregiverId) return;
    try {
      const { data } = await axios.get(
        `http://localhost:5148/api/user?id=${availability.caregiverId}`,
        { withCredentials: true }
      );
      setCaregiver(data);
    } catch (err) {
      console.error("Failed to fetch caregiver info:", err);
    }
  }

  useEffect(() => {
    fetchCaregiver();
  }, [availability]);

  // Slot is available
  if (isAvailable) {
    // Caregiver => remove availability
    if (isCaregiver) {
      return (
        <button
          onClick={() =>
            setPopup({
              isOpen: true,
              label: "Remove availability?",
              handleFunction: handleRemoveAvailability,
            })
          }
          className="flex flex-row justify-evenly w-full border-[1px] border-gray-500 bg-green-300 py-4"
        >
          <span>
            {date} at {time}
          </span>
          <span>(Click to remove)</span>
        </button>
      );
    }
    // Patient => "Book"
    if (loggedInUser?.roles?.includes("User")) {
      return (
        <button
          onClick={() =>
            setPopup({
              isOpen: true,
              label: "Book this time?",
              handleFunction: handleCreateBooking,
            })
          }
          className="flex flex-row justify-evenly w-full border-[1px] border-gray-500 bg-green-300 py-4"
        >
          <span>{`${date} at ${time}`}</span>
          <span>Available (click to book)</span>

          {caregiver && (
            <span>{`${caregiver.firstname} ${caregiver.lastname}`}</span>
          )}
        </button>
      );
    }
    // Some fallback
    return (
      <div className="flex flex-row justify-evenly w-full border-[1px] border-gray-500 bg-green-300 py-4">
        {`${date} at ${time} — Available`}
      </div>
    );
  }

  // Slot is NOT available
  else {
    // Caregiver => "Set availability"
    if (isCaregiver) {
      return (
        <button
          onClick={() =>
            setPopup({
              isOpen: true,
              label: "Set availability?",
              handleFunction: handleCreateAvailability,
            })
          }
          className="flex flex-col md:flex-row justify-evenly min-w-48 items-center md:min-w-full border border-gray-500 bg-gray-200 p-4 my-1"
        >
          <span>{`${date} at ${time}`}</span>
          <span>(Click to set availability)</span>
        </button>
      );
    }
    // Patient => "Unavailable"
    return (
      <div className="flex flex-row justify-evenly items-center border border-gray-500 bg-gray-50 py-4">
        <span>{`${date} at ${time}`}</span>
        <span className="text-red-500">Unavailable</span>
      </div>
    );
  }
}
