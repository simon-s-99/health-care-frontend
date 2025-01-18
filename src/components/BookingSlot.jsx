import { Calendar } from "@/components/ui/calendar";
import axios from "axios";
import { useEffect, useState } from "react";
import Booking from "./Booking";

export default function BookingSlot({ time, isAvailable, book, date, caregiverId }) {

  const [caregiver, setCaregiver] = useState(null);

  async function getCaregiver() {
    const {data} = await axios.get(`http://localhost:5148/api/user?id=${caregiverId}`)
    setCaregiver(data);
  }
  useEffect(() => {
    if (caregiverId) {
      getCaregiver();
    }
  }, [])
  if (isAvailable) {
    const dateTime = date + "T" + time;
    return (
      <button onClick={() => book("6787c0bdac13847d0e917f7b", caregiverId, dateTime)} className="flex flex-row justify-start w-full *:w-1/3 border-[1px] border-gray-500 bg-green-300 py-4">
        <span>Available, click to book</span><span>{date} at {time}</span><span>{caregiver && `Caregiver: ${caregiver.firstname} ${caregiver.lastname}`}</span>
      </button>
    );
  }
  return (
    <div className="border-l-[1px] block h-[7%] w-full border-black my-2">
    </div>
  );
}
