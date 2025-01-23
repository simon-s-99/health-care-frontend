import Booking from "./Booking";
import BookingSlot from "./BookingSlot";

export default function BookingsList({
  loggedInUser,
  availabilites,
  bookings,
  createBooking,
  date,
  cancelBooking,
}) {
  const timeSlots = [
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
    const bookingSlots = timeSlots;
    let counter = 13; // Start at 13 after the initial 12 in timeSlots

    // Loop through each booking and time slot, if the times match, add the booking to the respective time slot
    for (let i = 0; i < bookings.length; i++) {
      const currentBooking = bookings[i];
      for (let j = 0; j < bookingSlots.length; j++) {
        const currentTimeSlot = bookingSlots[j];
        if (currentBooking.dateTime.includes(currentTimeSlot.props.time)) {
          bookingSlots[j] = (
            <Booking
              key={counter}
              booking={currentBooking}
              cancelBooking={cancelBooking}
            />
          );
        }
        counter++;
      }
    }
    return { bookingSlots, counter };
  }

  function generateBookingSlotsForAvailableTimes(bookingSlots, counter) {

    // Loop through each available time, available times in each available time, and each time slot, if the times match, add the available time to the respective time slot
    for (let i = 0; i < availabilites.length; i++) {
      const currentAvailability = availabilites[i];
      for (let k = 0; k < bookingSlots.length; k++) {
        const currentTimeSlot = bookingSlots[k];
        if (
          currentAvailability.time === currentTimeSlot.props.time &&
          bookingSlots[k].type.name !== "Booking"
        ) {
          // Do not overwrite existing bookings
          bookingSlots[k] = (
            <BookingSlot
              key={counter}
              loggedInUser={loggedInUser}
              isAvailable={true}
              createBooking={createBooking}
              date={date}
              availability={currentAvailability}
            />
          );
          counter++;
        }
      }
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
    <div className="flex flex-col w-full h-full px-4 mb-[10%]">
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
