import { Calendar } from "@/components/ui/calendar";
import axios from "axios";
import { useEffect, useState } from "react";
import Booking from "./Booking";
import { useAuth } from "../hooks/useAuth";

export default function BookingSlot({
  time,
  isAvailable,
  book,
  date,
  caregiverId,
  confirmationMessage,
}) {
  const [caregiver, setCaregiver] = useState(null);
  const { authState } = useAuth();

  async function getCaregiver() {
    const { data } = await axios.get(
      `http://localhost:5148/api/user?id=${caregiverId}`
    );
    setCaregiver(data);
  }
  useEffect(() => {
    if (caregiverId) {
      getCaregiver();
    }
  }, []);
  if (isAvailable) {
    const dateTime = date + "T" + time;

    return (
      <>
        {authState.userId ? (
          <button
            onClick={() => book(authState.userId, caregiverId, dateTime)}
            className={
              !confirmationMessage
                ? "flex flex-row justify-start w-full *:w-1/3 border-[1px] border-gray-500 bg-green-300 py-4"
                : "w-full border-[1px] border-gray-500 bg-green-300 py-4 text-center"
            }
          >
            {!showConfirmationMessage ? (
              <>
                <span>Available, click to book</span>
                <span>
                  {date} at {time}
                </span>
                <span>
                  {caregiver &&
                    `Caregiver: ${caregiver.firstname} ${caregiver.lastname}`}
                </span>
              </>
            ) : (
              <span>Booked!</span>
            )}
          </button>
        ) : (
          <h2>{confirmationMessage}</h2>
        )}
      </>
    );
  }
  return (
    <div className="border-[1px] block h-[7%] w-full border-gray-500 my-2"></div>
  );
}
