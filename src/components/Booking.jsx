import { Calendar } from "@/components/ui/calendar";
import axios from "axios";
import { useEffect, useState } from "react";

export default function Booking({ booking, isAdmin }) {
  console.log(booking)
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  async function getUserData() {
    try {
      const { data } = await axios.get(
        `http://localhost:5148/api/user?id=${
          isAdmin ? booking.patientId : booking.caregiverId
        }`
      );
      setName(`${data.firstname} ${data.lastname}`);
    } catch (e) {
      console.log(e.response.data);
    }
  }
  useEffect(() => {
    getUserData();
    const splitDateTime = booking.dateTime.split("T");
    const formattedDate = splitDateTime.shift();
    const formattedTime = splitDateTime.pop();
    setDate(formattedDate)
    setTime(formattedTime);
  }, []);

  return (
    <div className="flex flex-row justify-start w-full *:w-1/3 border-[1px] border-gray-500 bg-blue-300 py-4">
      <span>{name}</span>
      <span>{date}</span>
      <span>{time}</span>
    </div>
  );
}
