import { Calendar } from "@/components/ui/calendar";
import axios from "axios";
import { useEffect, useState } from "react";

export default function Booking({booking, isAdmin}) {
  
  console.log(booking.dateTime)
  return (
    <div className="flex flex-row justify-center items-center">
      <span>{isAdmin ? booking.patientId : booking.caregiverId}</span><span>{booking.dateTime}</span>
    </div>
  );
}
