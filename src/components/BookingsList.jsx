import { Calendar } from "@/components/ui/calendar";
import axios from "axios";
import { useEffect, useState } from "react";
import Booking from "./Booking";

export default function BookingsList({bookings, isAdmin}) {
  
  return (
    <div className="flex flex-col justify-center w-full m-auto text-center">
        <div className="flex flex-row justify-center *:border-[1px] *:w-1/2">
          <h2>{isAdmin ? "Patient" : "Caregiver"}</h2>
          <h2>Time</h2>
        </div>
        {bookings.map(b => <Booking key={b.id} booking={b} isAdmin={isAdmin}/>)}
      </div>
  );
}
