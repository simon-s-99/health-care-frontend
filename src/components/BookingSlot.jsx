import axios from "axios";
import { useEffect, useState } from "react";

export default function BookingSlot({
  loggedInUser,
  isAvailable, // e.g. true/false
  date, // e.g. "2025-02-01"
  time, // e.g. "08:00"
  availability, // might be null if none
  setPopup,
  createBooking, // if you need booking logic for patients
}) {
  const [caregiver, setCaregiver] = useState(null);
  const isCaregiver = loggedInUser?.roles?.includes("Admin");

  // 1) CREATE availability
  async function handleCreateAvailability() {
    setPopup(null);
    try {
      // If there's an existing availability with dateTime, use that,
      // otherwise build one from date + time, e.g. "2025-02-01T08:00:00"
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
      // Optionally re-fetch in BookingsPage
    } catch (err) {
      console.error("Failed to create availability:", err);
    }
  }

  // 2) REMOVE availability
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

  // 3) PATIENT: (Optional) Book the slot
  function handleCreateBooking() {
    setPopup(null);
    // Build a dateTime "YYYY-MM-DDTHH:mm"
    const dateTimeStr = `${date}T${time}`;
    createBooking(loggedInUser.userId, availability?.caregiverId, dateTimeStr);
  }

  // 4) Optionally fetch caretaker info
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

  // -----------------------------
  // RENDER LOGIC
  // -----------------------------
  // A) If the slot is available
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
          <span>
            {caregiver &&
              `Caregiver: ${caregiver.firstname} ${caregiver.lastname}`}
          </span>
          <span>(Click to remove)</span>
        </button>
      );
    }
    // A2) Patient => show "Book" logic (if you want)
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
            <span>{`Caregiver: ${caregiver.firstname} ${caregiver.lastname}`}</span>
          )}
        </button>
      );
    }
    // A3) If neither caregiver nor patient => some fallback
    return (
      <div className="flex flex-row justify-evenly w-full border-[1px] border-gray-500 bg-green-300 py-4">
        {`${date} at ${time} — Available`}
      </div>
    );
  }

  // B) If the slot is NOT available
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
    // B2) Patient => show empty div
    return (
      <div className="border-[1px] block h-[7%] w-full border-gray-500 my-2" />
    );
  }
}
