import React, { useState, useEffect } from "react";

export default function FeedbackList() {
  // These are "state variables" used to store and update data in the component.
  const [feedback, setFeedback] = useState([]);
  const [comment, setComment] = useState("");
  const [appointmentId, setAppointmentId] = useState("");
  const [patientId, setPatientId] = useState("");
  const [rating, setRating] = useState(0); // Rating is initialized to 0
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // useEffect runs when the component is first loaded (like a setup).
  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        // Fetching feedback data from the backend
        const response = await fetch(`${process.env.VITE_API_URL}/Feedback`);
        if (!response.ok) {

          throw new Error("Failed to fetch feedback");
        }
        // Parse the JSON response from the server
        const data = await response.json();
        setFeedback(data); 
      } catch (err) {

        setError(err.message);
      } finally {
        // After the data is fetched (or an error occurs), stop showing the loading message
        setLoading(false);
      }
    };

    fetchFeedback();
  }, []); // Empty array ensures this only runs when the component is first loaded

  // Function to handle form submission when a user submits new feedback
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevents the page from refreshing when the form is submitted

    try {
      const newFeedback = { comment, appointmentId, patientId, rating };
      const response = await fetch(`${process.env.VITE_API_URL}/Feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" }, // Tell the server we're sending JSON data
        body: JSON.stringify(newFeedback), // Convert the feedback object into a JSON string
      });

      if (!response.ok) {
        throw new Error("Failed to create feedback"); // Handle server errors
      }

      // Parse the server's response (the newly created feedback)
      const createdFeedback = await response.json();
      setFeedback([...feedback, createdFeedback]); // Add the new feedback to the existing list
      setComment(""); 
      setAppointmentId(""); 
      setPatientId(""); 
      setRating(0); 
    } catch (err) {
      setError(err.message); 
    }
  };

  // Function to handle star clicks for rating
  const handleStarClick = (index) => {
    setRating(index + 1); // Update the rating based on the clicked star (1-indexed)
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-md">
      {/* Title for the feedback list */}
      <h2 className="text-xl font-semibold text-center mb-4">Feedback List</h2>
      
      {/* Display any error message */}
      {error && <p className="text-red-500 text-center">{error}</p>}

      {/* Show a loading message while feedback data is being fetched */}
      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : (
        // Display the list of feedback items
        <ul className="space-y-2 mb-6">
          {feedback.map((item) => (
            <li key={item.id} className="border p-3 rounded">
              <p>{item.comment}</p>
              <p className="text-gray-500 text-sm">Rating: {item.rating} ★</p> {/* Show the star rating */}
              <p className="text-gray-500 text-sm">Appointment ID: {item.appointmentId}</p>
              <p className="text-gray-500 text-sm">Patient ID: {item.patientId}</p>
            </li>
          ))}
        </ul>
      )}

      {/* Form for submitting new feedback */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Star Rating Input */}
        <div className="flex justify-center space-x-1 mb-4">
          {/* Render 5 stars for the user to click */}
          {[...Array(5)].map((_, index) => (
            <span
              key={index}
              className={`text-3xl cursor-pointer ${
                index < rating ? "text-yellow-400" : "text-gray-300" // Highlight stars up to the current rating
              }`}
              onClick={() => handleStarClick(index)} // Handle click on the star
            >
              ★
            </span>
          ))}
        </div>

        {/* Comment Input */}
        <textarea
          placeholder="Comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)} // Update the comment as the user types
          className="w-full p-3 border rounded"
          required // Make this field required
        />

        {/* Appointment ID Input */}
        <input
          type="text"
          placeholder="Appointment ID"
          value={appointmentId}
          onChange={(e) => setAppointmentId(e.target.value)} // Update the appointment ID as the user types
          className="w-full p-3 border rounded"
          required
        />

        {/* Patient ID Input */}
        <input
          type="text"
          placeholder="Patient ID"
          value={patientId}
          onChange={(e) => setPatientId(e.target.value)} // Update the patient ID as the user types
          className="w-full p-3 border rounded"
          required
        />

        {/* Submit Button */}
        <button className="w-full bg-blue-500 text-white p-2 rounded">Submit</button>
      </form>
    </div>
  );
}
