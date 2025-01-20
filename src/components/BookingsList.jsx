import { Calendar } from "@/components/ui/calendar";
import axios from "axios";
import { useEffect, useState } from "react";
import Booking from "./Booking";
import BookingSlot from "./BookingSlot";

export default function BookingsList({
  availableTimes,
  isAdmin,
  bookings,
  book,
  date,
  showConfirmationMessage
}) {
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

  const dateHeading = new Date(date).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  function generateBookingSlotsForExistingBookings() {
    const bookingSlots = timeSlotElements;
    let counter = 13; // Start at 13 after the initial 12 in timeSlotElements
    for (let i = 0; i < bookings.length; i++) {
      const currentBooking = bookings[i];
      for (let j = 0; j < timeSlots.length; j++) {
        const currentTimeSlot = timeSlots[j];
        if (currentBooking.dateTime.includes(currentTimeSlot)) {
          bookingSlots[j] = <Booking key={counter} booking={currentBooking} />;
        }
      }
      counter++;
    }
    return { bookingSlots, counter };
  }

  function generateBookingSlotsForAvailableTimes(bookingSlots, counter) {
    for (let i = 0; i < availableTimes.length; i++) {
      const currentAvailableTime = availableTimes[i];
      for (let j = 0; j < currentAvailableTime.availableSlots.length; j++) {
        const currentAvailableSlot = currentAvailableTime.availableSlots[j];
        for (let k = 0; k < timeSlots.length; k++) {
          const currentTimeSlot = timeSlots[k];
          if (currentAvailableSlot === currentTimeSlot) {
            bookingSlots[k] = (
              <BookingSlot
                key={counter}
                isAvailable={true}
                book={book}
                date={date}
                time={currentAvailableSlot}
                caregiverId={currentAvailableTime.caregiverId}
                showConfirmationMessage={showConfirmationMessage}
              />
            );
          }
        }
      }
      counter++;
    }
    return bookingSlots;
  }
  function generateBookingSlots() {
    const { bookingSlots, counter } = generateBookingSlotsForExistingBookings();
    const completeBookingSlots = generateBookingSlotsForAvailableTimes(
      bookingSlots,
      counter
    );
    return completeBookingSlots;
  }
  return (
    <div className="flex flex-col w-full h-full px-4">
      <h2 className="text-xl text-center font-bold">{dateHeading}</h2>
      <div className="flex flex-row text-center">
        <ul className="w-fit *:h-[7%] *:my-2 *:py-4 *:mr-2">
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
    </div>
  );
}
