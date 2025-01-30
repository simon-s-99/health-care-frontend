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
  setConfirmationMessage
}) {
  const [caregiver, setCaregiver] = useState(null);
  const isCaregiver = loggedInUser?.roles?.includes("Admin");

  // 1) CREATE
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

  // 2) REMOVE
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

  // 3) BOOK
  // function handleCreateBooking() {
  //   setPopup(null);
  //   const dateTimeStr = `${date}T${time}`;
  //   createBooking(loggedInUser.userId, availability?.caregiverId, dateTimeStr);
  // }

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
      setConfirmationMessage("Booking confirmed!");
      if (onBookingUpdated) {
        onBookingUpdated();
        getAllAvailabilities();
      }
    } else {
      setConfirmationMessage("Something went wrong.");
    }
  }

  // 4) Fetch caretaker name if needed
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

  // A) Slot is available
  if (isAvailable) {
    // A1) Caregiver => remove availability
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
          {/* Remove caretaker label altogether, or conditionally hide */}
          {/* If you prefer to show it only if caregiver.id != loggedInUser.userId, do: 
            {caregiver && caregiver.id !== loggedInUser.userId && `Caregiver: ${caregiver.firstname} ${caregiver.lastname}`}
          */}
          <span>(Click to remove)</span>
        </button>
      );
    }
    // A2) Patient => "Book"
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
          {/* If you want to show caretaker name, do: */}
          {caregiver && (
            <span>{`${caregiver.firstname} ${caregiver.lastname}`}</span>
          )}
        </button>
      );
    }
    // A3) Some fallback
    return (
      <div className="flex flex-row justify-evenly w-full border-[1px] border-gray-500 bg-green-300 py-4">
        {`${date} at ${time} — Available`}
      </div>
    );
  }

  // B) Slot is NOT available
  else {
    // B1) Caregiver => "Set availability"
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
          className="flex flex-row justify-evenly w-full border-[1px] border-gray-500 bg-gray-200 py-4"
        >
          <span>{`${date} at ${time}`}</span>
          <span>(Click to set availability)</span>
        </button>
      );
    }
    // B2) Patient => "Unavailable"
    return (
      <div className="flex flex-row justify-evenly items-center border border-gray-500 bg-gray-50 py-4">
        <span>{`${date} at ${time}`}</span>
        <span className="text-red-500">Unavailable</span>
      </div>
    );
  }
}
