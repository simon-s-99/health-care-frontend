import React, {useState, useEffect} from "react";

export default function FeedbackList() {
    const [feedback, setFeedback] = useState([]);
    const [comment, setComment] = useState("");
    const [appointmentId, setAppointmentId] = useState("");
    const [patientId, setPatientId] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      const fetchFeedback = async () => {
        try {
          const response = await fetch(`https://localhost:7085/api/Feedback`);
          if (!response.ok) {
            throw new Error("Failed to fetch feedback");
          }
          const data = await response.json();
          setFeedback(data);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
  
      fetchFeedback();
    }, []);
  
    const handleSubmit = async (e) => {
      e.preventDefault();
  
      try {
        const newFeedback = { comment, appointmentId, patientId };
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/Feedback`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newFeedback),
        });
  
        if (!response.ok) {
          throw new Error("Failed to create feedback");
        }
  
        const createdFeedback = await response.json();
        setFeedback([...feedback, createdFeedback]); // Update the list
        setComment("");
        setAppointmentId("");
        setPatientId("");
      } catch (err) {
        setError(err.message);
      }
    };
  
    return (
      <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-md">
        <h2 className="text-xl font-semibold text-center mb-4">Feedback List</h2>
        {error && <p className="text-red-500 text-center">{error}</p>}
        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : (
          <ul className="space-y-2 mb-6">
            {feedback.map((item) => (
              <li key={item.id} className="border p-3 rounded">
                <p>{item.comment}</p>
                <p className="text-gray-500 text-sm">Appointment ID: {item.appointmentId}</p>
                <p className="text-gray-500 text-sm">Patient ID: {item.patientId}</p>
              </li>
            ))}
          </ul>
        )}
  
        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            placeholder="Comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full p-3 border rounded"
            required
          />
          <input
            type="text"
            placeholder="Appointment ID"
            value={appointmentId}
            onChange={(e) => setAppointmentId(e.target.value)}
            className="w-full p-3 border rounded"
            required
          />
          <input
            type="text"
            placeholder="Patient ID"
            value={patientId}
            onChange={(e) => setPatientId(e.target.value)}
            className="w-full p-3 border rounded"
            required
          />
          <button className="w-full bg-blue-500 text-white p-2 rounded">Submit</button>
        </form>
      </div>
    );
  };
  