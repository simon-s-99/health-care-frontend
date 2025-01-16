import { Calendar } from "@/components/ui/calendar";
import axios from "axios";
import { useEffect, useState } from "react";

export default function Booking({ booking, isAdmin }) {
  const [name, setName] = useState("");
  const [time, setTime] = useState("");
  useEffect(() => {
    async function getUserData() {
      try {
        const { data } = await axios.get(
          `http://localhost:5148/api/user?id=${
            isAdmin ? booking.patientId : booking.caregiverId
          }`
        );
        console.log(data);
        setName(`${data.firstname} ${data.lastname}`);
      } catch (e) {
        console.log(e.response.data);
      }
    }
    getUserData();
    const formattedTime = booking.dateTime.split("T").pop().slice(0, 5);
    setTime(formattedTime);
  }, []);

  return (
    <div className="flex flex-row justify-start w-full *:w-1/2">
      <span>{name}</span>
      <span>{time}</span>
    </div>
  );
}
