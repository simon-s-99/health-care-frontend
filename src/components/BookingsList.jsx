import { Calendar } from "@/components/ui/calendar";
import axios from "axios";
import { useEffect, useState } from "react";
import Booking from "./Booking";
import BookingSlot from "./BookingSlot";


export default function BookingsList({ bookings, isAdmin }) {

  return (
    <div className="flex flex-row text-center w-full">
      <ul className="h-full">
        <li>08:00</li>
        <li>09:00</li>
        <li>10:00</li>
        <li>11:00</li>
        <li>12:00</li>
        <li>13:00</li>
        <li>14:00</li>
        <li>15:00</li>
        <li>16:00</li>
        <li>17:00</li>
        <li>18:00</li>
        <li>19:00</li>
        <li>20:00</li>
      </ul>
      <div>
      <BookingSlot time="08:00"/>
      <BookingSlot time="09:00"/>
      <BookingSlot time="10:00"/>
      <BookingSlot time="11:00"/>
      <BookingSlot time="12:00"/>
      <BookingSlot time="13:00"/>
      <BookingSlot time="14:00"/>
      <BookingSlot time="15:00"/>
      <BookingSlot time="16:00"/>
      <BookingSlot time="17:00"/>
      <BookingSlot time="18:00" />
      <BookingSlot time="19:00"/>
      <BookingSlot time="20:00"/>

      </div>
      {/* {bookings.map((b) => (
        <Booking key={b.id} booking={b} isAdmin={isAdmin} />
      ))} */}
    </div>
  );
}
