import { Calendar } from "@/components/ui/calendar";
import axios from "axios";
import { useEffect, useState } from "react";

export default function Booking({ booking, isAdmin }) {
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
    const formattedTime = splitDateTime.pop().slice(0, 5);
    setDate(formattedDate)
    setTime(formattedTime);
  }, []);

  return (
    <div className="flex flex-row justify-start w-full *:w-1/3 border-[1px] border-black">
      <span>{name}</span>
      <span className="border-l-[1px] border-r-[1px] border-black">{date}</span>
      <span>{time}</span>
    </div>
  );
}
