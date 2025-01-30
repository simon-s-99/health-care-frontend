import Booking from "./Booking";
import BookingSlot from "./BookingSlot";

/**
 * This component:
 * 1. Creates fixed time slots from 08:00 to 20:00 (each is a <BookingSlot>).
 * 2. Overwrites any slot with <Booking> if we find a matching "booking".
 * 3. Overwrites any slot with <BookingSlot isAvailable /> if we find a matching "availability".
 */
export default function BookingsList({
  loggedInUser,
  availabilites,
  bookings,
  createBooking,
  date,
  cancelBooking,
  setPopup,
}) {
  // 1) Create your fixed array of <BookingSlot> from 08:00 to 20:00
  const timeSlots = [
    <BookingSlot
      key={0}
      isAvailable={false}
      time="08:00"
      date={date}
      loggedInUser={loggedInUser}
      setPopup={setPopup}
      createBooking={createBooking}
    />,
    <BookingSlot
      key={1}
      isAvailable={false}
      time="09:00"
      date={date}
      loggedInUser={loggedInUser}
      setPopup={setPopup}
      createBooking={createBooking}
    />,
    <BookingSlot
      key={2}
      isAvailable={false}
      time="10:00"
      date={date}
      loggedInUser={loggedInUser}
      setPopup={setPopup}
      createBooking={createBooking}
    />,
    <BookingSlot
      key={3}
      isAvailable={false}
      time="11:00"
      date={date}
      loggedInUser={loggedInUser}
      setPopup={setPopup}
      createBooking={createBooking}
    />,
    <BookingSlot
      key={4}
      isAvailable={false}
      time="12:00"
      date={date}
      loggedInUser={loggedInUser}
      setPopup={setPopup}
      createBooking={createBooking}
    />,
    <BookingSlot
      key={5}
      isAvailable={false}
      time="13:00"
      date={date}
      loggedInUser={loggedInUser}
      setPopup={setPopup}
      createBooking={createBooking}
    />,
    <BookingSlot
      key={6}
      isAvailable={false}
      time="14:00"
      date={date}
      loggedInUser={loggedInUser}
      setPopup={setPopup}
      createBooking={createBooking}
    />,
    <BookingSlot
      key={7}
      isAvailable={false}
      time="15:00"
      date={date}
      loggedInUser={loggedInUser}
      setPopup={setPopup}
      createBooking={createBooking}
    />,
    <BookingSlot
      key={8}
      isAvailable={false}
      time="16:00"
      date={date}
      loggedInUser={loggedInUser}
      setPopup={setPopup}
      createBooking={createBooking}
    />,
    <BookingSlot
      key={9}
      isAvailable={false}
      time="17:00"
      date={date}
      loggedInUser={loggedInUser}
      setPopup={setPopup}
      createBooking={createBooking}
    />,
    <BookingSlot
      key={10}
      isAvailable={false}
      time="18:00"
      date={date}
      loggedInUser={loggedInUser}
      setPopup={setPopup}
      createBooking={createBooking}
    />,
    <BookingSlot
      key={11}
      isAvailable={false}
      time="19:00"
      date={date}
      loggedInUser={loggedInUser}
      setPopup={setPopup}
      createBooking={createBooking}
    />,
    <BookingSlot
      key={12}
      isAvailable={false}
      time="20:00"
      date={date}
      loggedInUser={loggedInUser}
      setPopup={setPopup}
      createBooking={createBooking}
    />,
  ];

  // 2) Format the date heading
  const dateHeading = new Date(date).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // 3) Insert any *bookings* into the timeslots
  function generateBookingSlotsForExistingBookings() {
    const bookingSlots = [...timeSlots]; // copy the array
    let counter = 100; // unique key offset

    for (let i = 0; i < bookings.length; i++) {
      const currentBooking = bookings[i];
      for (let j = 0; j < bookingSlots.length; j++) {
        const currentTimeSlot = bookingSlots[j];
        // If the booking's dateTime string includes the same time
        // e.g. "13:00", then replace that slot with a <Booking> component
        if (currentBooking.dateTime.includes(currentTimeSlot.props.time)) {
          bookingSlots[j] = (
            <Booking
              key={counter}
              booking={currentBooking}
              cancelBooking={cancelBooking}
              setPopup={setPopup}
            />
          );
          counter++;
        }
      }
    }
    return { bookingSlots, counter };
  }

  // 4) Insert any *availabilities* into the timeslots (if no booking in that slot)
  function generateBookingSlotsForAvailableTimes(bookingSlots, counter) {
    for (let i = 0; i < availabilites.length; i++) {
      const currentAvailability = availabilites[i];
      // Convert the availability's dateTime to "HH:mm" in "sv-SE"
      const availabilityTime = new Date(
        currentAvailability.dateTime
      ).toLocaleTimeString("sv-SE", {
        hour: "2-digit",
        minute: "2-digit",
      });

      for (let k = 0; k < bookingSlots.length; k++) {
        const slotElement = bookingSlots[k];
        // Make sure we don't overwrite a <Booking> slot
        if (
          availabilityTime === slotElement.props.time &&
          slotElement.type !== Booking
        ) {
          bookingSlots[k] = (
            <BookingSlot
              key={counter}
              loggedInUser={loggedInUser}
              isAvailable={true}
              createBooking={createBooking}
              date={date}
              availability={currentAvailability}
              time={availabilityTime} // pass time explicitly
              setPopup={setPopup}
            />
          );
          counter++;
        }
      }
    }
    return bookingSlots;
  }

  // 5) Combine them
  function generateBookingSlots() {
    const { bookingSlots, counter } = generateBookingSlotsForExistingBookings();
    const finalSlots = generateBookingSlotsForAvailableTimes(
      bookingSlots,
      counter
    );
    return finalSlots;
  }

  return (
    <div className="flex flex-col w-full h-full px-4 mb-[10%]">
      <h2 className="text-xl text-center font-bold">{dateHeading}</h2>
      <div className="flex flex-row text-center">
        <div className="w-full">{generateBookingSlots()}</div>
      </div>
    </div>
  );
}
