import { Calendar } from "@/components/ui/calendar";
import axios from "axios";
import { useEffect, useState } from "react";
import BookingsList from "./BookingsList";
import { useAuth } from "../hooks/useAuth";
import { Button } from "./ui/button";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "./ui/select";

export default function BookingsPage() {
  const currentDateTime = new Date(Date.now());

  const {
    authState: { user },
  } = useAuth();
  const isAdmin = user && user.roles.includes("Admin");

  const [time, setTime] = useState("08:00");
  const [date, setDate] = useState(new Date());
  const [error, setError] = useState("");
  const [bookings, setBookings] = useState([]);

  async function handleSubmit(e) {
    e.preventDefault();

    setError("");

    const patientId = "6787c0bdac13847d0e917f7b";
    const caregiverId = "6787d1ac02047fbc901e65fd";
    const status = 1;
    const dateCopy = date;
    dateCopy.setHours(parseInt(time.slice(0, 2)));
    dateCopy.setMinutes(parseInt(time.slice(3)));
    setDate(dateCopy);

    if (date < currentDateTime) {
      setError("Invalid date.");
      return;
    }

    try {
      await axios.post("http://localhost:5148/api/appointment", {
        PatientId: patientId,
        CaregiverId: caregiverId,
        Status: status,
        DateTime: date,
      });
    } catch (e) {
      setError(e.response.data);
    }
  }
  async function getUserAppointments() {
    const { data } = await axios.get(
      `http://localhost:5148/api/appointment/user?id=${"6787c0bdac13847d0e917f7b"}&isPatient=true`
    );
    setBookings(data);
  }

  useEffect(() => {
    getUserAppointments();
  }, []);

  return (
    <div className="flex flex-col justify-center items-center">
      {error && <span className="text-red-500">{error}</span>}
      <form onSubmit={handleSubmit}>
        <label className="inline-flex gap-2">
          Time
          <Select
            className="border-[1px] border-black"
            defaultValue={time}
            onValueChange={(e) => setTime(e)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Theme" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="08:00">08:00</SelectItem>
              <SelectItem value="09:00">09:00</SelectItem>
              <SelectItem value="10:00">10:00</SelectItem>
              <SelectItem value="11:00">11:00</SelectItem>
              <SelectItem value="12:00">12:00</SelectItem>
              <SelectItem value="13:00">13:00</SelectItem>
              <SelectItem value="14:00">14:00</SelectItem>
              <SelectItem value="15:00">15:00</SelectItem>
              <SelectItem value="16:00">16:00</SelectItem>
              <SelectItem value="17:00">17:00</SelectItem>
              <SelectItem value="18:00">18:00</SelectItem>
              <SelectItem value="19:00">19:00</SelectItem>
              <SelectItem value="20:00">20:00</SelectItem>
            </SelectContent>
          </Select>
        </label>
        <Button className="font-bold ml-8 bg-green-700" type="submit">
          Submit
        </Button>
        <Calendar
          className="*:bg-white"
          mode="single"
          disabled={{ before: currentDateTime }}
          selected={date}
          onSelect={setDate}
        />
      </form>
        <BookingsList bookings={bookings} isAdmin={isAdmin} />
    </div>
  );
}
