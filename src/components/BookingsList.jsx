import { Calendar } from "@/components/ui/calendar";
import axios from "axios";
import { useEffect, useState } from "react";
import Booking from "./Booking";

export default function BookingsList({bookings, isAdmin}) {
  
  return (
    <div className="flex flex-col justify-center m-auto text-center">
        <div className="flex flex-row justify-center *:border-[1px] *:border-black *:w-1/3">
          <h2>{isAdmin ? "Patient" : "Caregiver"}</h2>
          <h2>Date</h2>
          <h2>Time</h2>
        </div>
        {bookings.map(b => <Booking key={b.id} booking={b} isAdmin={isAdmin}/>)}
      </div>
  );
}
