import { Calendar } from "@/components/ui/calendar";
import axios from "axios";
import { useEffect, useState } from "react";
import Booking from "./Booking";

export default function BookingSlot({ time, isAvailable, book, date, caregiverId }) {

  if (isAvailable) {
    const dateTime = date + "T" + time;
    console.log(dateTime)
    return (
      <button onClick={() => book("6787c0bdac13847d0e917f7b", caregiverId, dateTime)} className="border-l-[1px] block h-[7%] w-full border-black my-2 bg-green-300">
        Book
      </button>
    );
  }
  return (
    <div className="border-l-[1px] block h-[7%] w-full border-black my-2 bg-red-300">
    </div>
  );
}
