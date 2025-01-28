import axios from "axios";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button"
import { Appointment, Popup } from "@/lib/types";

interface Props {
  booking: Appointment;
  cancelBooking: (appointmentId: string) => boolean;
  setPopup: React.Dispatch<React.SetStateAction<Popup>>;
}

export default function Booking({ booking, cancelBooking, setPopup }: Props) {
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [confirmationMessage, setConfirmationMessage] = useState("");

  function handleCancelBooking() {
    setPopup(null);

    if (!booking.id) {
      throw new Error("Booking ID is null or undefined.");
    }

    const success = cancelBooking(booking.id!);

    if (success) {
      setConfirmationMessage("Booking cancelled.");
    } else {
      setConfirmationMessage("Something went wrong.");
    }
  }

  useEffect(() => {
    async function getCaregiverData() {
      try {
        const { data } = await axios.get(
          `http://localhost:5148/api/user?id=${booking.caregiverId}`,
          {
            withCredentials: true,
          }
        );
        setName(`${data.firstname} ${data.lastname}`);
      } catch (e) {
        console.log(e);
      }
    }

    getCaregiverData();
    const splitDateTime = booking.dateTime.split(" ");
    const formattedDate = splitDateTime.shift();
    const formattedTime = splitDateTime.pop();
    setDate(formattedDate as string);
    setTime(formattedTime as string);
  }, [booking]);

  return (
    <div className="flex flex-row justify-center w-full *:w-1/3 border-[1px] border-gray-500 bg-blue-300 py-4 my-2">
      {!confirmationMessage ? (
        <>
          <div className="flex flex-row justify-evenly">
            <span>Caregiver: {name}</span>
            <span>{date}</span>
            <span>{time}</span>
          </div>

          <div>
            <Button
              onClick={() =>
                setPopup({
                  isOpen: true,
                  label: "Cancel appointment?",
                  handleFunction: handleCancelBooking,
                  setPopup: setPopup,
                })
              }
            >
              Cancel appointment
            </Button>
          </div>
        </>
      ) : (
        <h2>{confirmationMessage}</h2>
      )}
    </div>
  );
}
