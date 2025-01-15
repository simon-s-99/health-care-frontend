import { Calendar } from "@/components/ui/calendar";
import axios from "axios";
import { useState } from "react";

export default function Booking() {
  const currentDateTime = new Date(Date.now());
  const currentTime = currentDateTime.toLocaleTimeString("sv-SE").slice(0, 5);

  const [time, setTime] = useState(currentTime);
  const [date, setDate] = useState(new Date());
  const [error, setError] = useState("");
  async function handleSubmit(e) {
    e.preventDefault();

    setError("");

    const patientId = "";
    const caregiverId = "";
    const status = "";
    const dateCopy = date;
    dateCopy.setHours(parseInt(time.slice(0, 2)));
    dateCopy.setMinutes(parseInt(time.slice(3)));
    setDate(dateCopy);

    if (date < currentDateTime) {
      setError("Invalid date.");
      return;
    }
    const formData = FormData();
    formData.append("patientId", patientId);
    formData.append("caregiverId", caregiverId);
    formData.append("status", status);
    formData.append("dateTime", date);
    const request = await axios.post("http://localhost:5148/api/appointment");
  }
  return (
    <div className="flex flex-col justify-center items-center">
      {error && <span className="text-red-500">{error}</span>}
      <form onSubmit={handleSubmit}>
        <label className="inline-flex gap-2 ">
          Time
          <input
            className="border-[1px] border-black"
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
        </label>
        <button type="submit">Submit</button>
        <Calendar
          mode="single"
          disabled={{ before: new Date() }}
          selected={date}
          onSelect={setDate}
        />
      </form>
    </div>
  );
}
