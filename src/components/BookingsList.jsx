import { Calendar } from "@/components/ui/calendar";
import axios from "axios";
import { useEffect, useState } from "react";
import Booking from "./Booking";
import BookingSlot from "./BookingSlot";

export default function BookingsList({ availableTimes, isAdmin, bookings, book, date }) {
  const timeSlots = [
    "08:00",
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
    "19:00",
    "20:00",
  ];

  const timeSlotElements = [
    <BookingSlot key={0} isAvailable={false} time={"08:00"} />,
    <BookingSlot key={1} isAvailable={false} time={"09:00"} />,
    <BookingSlot key={2} isAvailable={false} time={"10:00"} />,
    <BookingSlot key={3} isAvailable={false} time={"11:00"} />,
    <BookingSlot key={4} isAvailable={false} time={"12:00"} />,
    <BookingSlot key={5} isAvailable={false} time={"13:00"} />,
    <BookingSlot key={6} isAvailable={false} time={"14:00"} />,
    <BookingSlot key={7} isAvailable={false} time={"15:00"} />,
    <BookingSlot key={8} isAvailable={false} time={"16:00"} />,
    <BookingSlot key={9} isAvailable={false} time={"17:00"} />,
    <BookingSlot key={10} isAvailable={false} time={"18:00"} />,
    <BookingSlot key={11} isAvailable={false} time={"19:00"} />,
    <BookingSlot key={12} isAvailable={false} time={"20:00"} />,
  ];

  function generateBookingSlotsForExistingBookings() {
    const bookingSlots = timeSlotElements;
    let counter = 13;
    for (let i = 0; i < bookings.length; i++) {
      for (let j = 0; j < timeSlots.length; j++) {
        if (bookings[i].dateTime.includes(timeSlots[j])) {
          bookingSlots[j] = <Booking key={counter} booking={bookings[i]} />;
        }
      }
      counter++;
    }
    return { bookingSlots, counter };
  }

  function generateBookingSlotsForAvailableTimes(bookingSlots, counter) {
    for (let i = 0; i < availableTimes.length; i++) {
      for (let j = 0; j < availableTimes[i].availableSlots.length; j++) {
        for (let k = 0; k < timeSlots.length; k++) {
          if (availableTimes[i].availableSlots[j] === timeSlots[k]) {
            bookingSlots[k] = <BookingSlot key={counter} isAvailable={true} book={book} date={date} time={timeSlots[k]} caregiverId={availableTimes[i].caregiverId} />;
          }
        }
        counter++;
      }
      return bookingSlots;
    }
  }
  function generateBookingSlots() {
    const { bookingSlots, counter } = generateBookingSlotsForExistingBookings();
    const availableTimeElements = generateBookingSlotsForAvailableTimes(
      bookingSlots,
      counter
    );

    return availableTimeElements;
  }
  return (
    <div className="flex flex-row text-center w-full border-2">
      <ul className="w-fit *:h-[7%] *:my-2">
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
      <div className="w-full">{generateBookingSlots()}</div>
    </div>
  );
}
