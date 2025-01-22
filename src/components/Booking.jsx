import axios from "axios";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
export default function Booking({
  booking,
  cancelBooking,
  confirmationMessage,
}) {
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  async function getUserData() {
    try {
      const { data } = await axios.get(
        `http://localhost:5148/api/user?id=${booking.patientId}`
      );
      setName(`${data.firstname} ${data.lastname}`);
    } catch (e) {
      console.log(e);
    }
  }
  useEffect(() => {
    getUserData();
    const splitDateTime = booking.dateTime.split(" ");
    const formattedDate = splitDateTime.shift();
    const formattedTime = splitDateTime.pop();
    setDate(formattedDate);
    setTime(formattedTime);
  }, []);

  return (
    <div className="flex flex-row justify-start w-full *:w-1/3 border-[1px] border-gray-500 bg-blue-300 py-4 my-2">
      {!confirmationMessage ? (
        <>
          <div className="flex flex-row justify-evenly">
            <span>Caregiver: {name}</span>
            <span>{date}</span>
            <span>{time}</span>
          </div>

          <div>
            <Button onClick={() => cancelBooking(booking.id)}>Cancel</Button>
          </div>
        </>
      ) : (
        <h2>{confirmationMessage}</h2>
      )}
    </div>
  );
}
