import axios from "axios";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
export default function Booking({
  booking,
  cancelBooking,
}) {
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [confirmationMessage, setConfirmationMessage] = useState("");

  function handleCancelBooking() {
    const success = cancelBooking(booking.id);

    if (success) {
      setConfirmationMessage("Booking cancelled.");
    } else {
      setConfirmationMessage("Something went wrong.");
    }
  }
  async function getCaregiverData() {
    try {
      const { data } = await axios.get(
        `http://localhost:5148/api/user?id=${booking.caregiverId}`
      );
      setName(`${data.firstname} ${data.lastname}`);
    } catch (e) {
      console.log(e);
    }
  }
  useEffect(() => {
    getCaregiverData();
    const splitDateTime = booking.dateTime.split(" ");
    const formattedDate = splitDateTime.shift();
    const formattedTime = splitDateTime.pop();
    setDate(formattedDate);
    setTime(formattedTime);
  }, []);

  return (
    <div className="flex flex-row justify-center w-full *:w-1/3 border-[1px] border-gray-500 bg-blue-300 py-4 my-2">
      {!confirmationMessage ? (
        <>
          <div className="flex flex-row justify-evenly">
            <span>Caregiver: {name}</span>
            <span>{date}</span>
            <span>{time}</span>
          </div>

          <div>
            <Button onClick={handleCancelBooking}>Cancel</Button>
          </div>
        </>
      ) : (
        <h2>{confirmationMessage}</h2>
      )}
    </div>
  );
}
