import axios from "axios";
import { useEffect, useState } from "react";

export default function BookingSlot({
  loggedInUser,
  isAvailable,
  createBooking,
  date,
  availability,
  setPopup,
}) {
  const [caregiver, setCaregiver] = useState(null);
  const [confirmationMessage, setConfirmationMessage] = useState("");

  function handleCreateBooking() {
    setPopup(null);

    const dateTime = date + "T" + new Date(availability.dateTime).toLocaleTimeString("sv-SE", {hour: "2-digit", minute: "2-digit"});
    const success = createBooking(
      loggedInUser.userId,
      availability.caregiverId,
      dateTime
    );
    if (success) {
      setConfirmationMessage("Booking confirmed!");
    } else {
      setConfirmationMessage("Something went wrong.");
    }
  }
  async function getCaregiver() {
    const { data } = await axios.get(
      `http://localhost:5148/api/user?id=${availability.caregiverId}`,
      {
        withCredentials: true,
      }
    );
    setCaregiver(data);
  }
  useEffect(() => {
    if (availability && availability.caregiverId) {
      getCaregiver();
    }
  }, []);
  if (isAvailable) {
    return (
      <>
        {loggedInUser.userId && loggedInUser.roles.includes("User") ? (
          <button
            onClick={() =>
              setPopup({
                isOpen: true,
                label: "Create booking?",
                handleFunction: handleCreateBooking,
                setPopup: setPopup,
              })
            }
            className={
              !confirmationMessage
                ? "flex flex-row justify-start w-full *:w-1/3 border-[1px] border-gray-500 bg-green-300 py-4"
                : "w-full border-[1px] border-gray-500 bg-green-300 py-4 text-center"
            }
          >
            {!confirmationMessage ? (
              <>
                <span>Available, click to book</span>
                <span>
                  {date} at {availability.time}
                </span>
                <span>
                  {caregiver &&
                    `Caregiver: ${caregiver.firstname} ${caregiver.lastname}`}
                </span>
              </>
            ) : (
              <span>{confirmationMessage}</span>
            )}
          </button>
        ) : (
          <div className="flex flex-row justify-evenly w-full *:w-1/3 border-[1px] border-gray-500 bg-green-300 py-4">
            <span>
              {date} at {availability.time}
            </span>
            <span>
              {caregiver &&
                `Caregiver: ${caregiver.firstname} ${caregiver.lastname}`}
            </span>
          </div>
        )}
      </>
    );
  }
  return (
    <div className="border-[1px] block h-[7%] w-full border-gray-500 my-2"></div>
  );
}
