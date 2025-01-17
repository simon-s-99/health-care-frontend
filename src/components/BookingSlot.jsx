import { Calendar } from "@/components/ui/calendar";
import axios from "axios";
import { useEffect, useState } from "react";
import Booking from "./Booking";

export default function BookingSlot({ booking, isAdmin, time }) {

  return (
    <div className="w-full border-[1px] border-black">
      {booking ? <Booking booking={booking}/> : <h1>Available</h1>}
    </div>
  );
}
