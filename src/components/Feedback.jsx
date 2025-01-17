import React, { useState, useEffect } from "react";
import axios from "axios";

export default function FeedbackList() {
  // State variables to store and manage feedback, form data, and application state.
  const [feedback, setFeedback] = useState([]);
  const [comment, setComment] = useState("");
  const [appointmentId, setAppointmentId] = useState("");
  const [patientId, setPatientId] = useState("");
  const [rating, setRating] = useState(0); // Rating is initialized to 0
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch feedback data when the component loads
  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5148/api/feedback`
        );
        setFeedback(response.data); // Update the feedback list with the fetched data
      } catch (err) {
        // Handle errors during the fetch operation
        setError(err.response?.data?.message || "Failed to fetch feedback");
      } finally {
        // Set loading to false after the operation completes
        setLoading(false);
      }
    };

    fetchFeedback();
  }, []); // Empty dependency array ensures this runs only once on component load

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload on form submission
    setError(null); // Clear any previous error messages

    try {
      const newFeedback = { appointmentId, patientId, comment, rating};

      // Make a POST request to submit new feedback. The headers tells the backend what kind of data to expect in the request body
      const response = await axios.post(
        `http://localhost:5148/api/feedback`,
        newFeedback,
        { headers: { "Content-Type": "application/json" } }
      );

      // Add the new feedback to the current list
      setFeedback((prevFeedback) => [...prevFeedback, response.data]);

      // Reset form inputs
      setComment("");
      setAppointmentId("");
      setPatientId("");
      setRating(0);
    } catch (err) {
      // Display error message if the request fails
      setError(err.response?.data?.message || "Failed to create feedback");
    }
  };

  // Function to handle star click for rating
  const handleStarClick = (index) => {
    setRating(index + 1); // Set rating based on the clicked star
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-md">
      {/* Title for the feedback list */}
      <h2 className="text-xl font-semibold text-center mb-4">Feedback List</h2>

      {/* Display error messages */}
      {error && <p className="text-red-500 text-center">{error}</p>}

      {/* Show a loading message while fetching feedback data */}
      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : (
        // Display the list of feedback items
        <ul className="space-y-2 mb-6">
          {feedback.map((item) => (
            <li key={item.id} className="border p-3 rounded">
              <p>{item.comment}</p>
              <p className="text-gray-500 text-sm">Rating: {item.rating} ★</p>
              <p className="text-gray-500 text-sm">
                Appointment ID: {item.appointmentId}
              </p>
              <p className="text-gray-500 text-sm">Patient ID: {item.patientId}</p>
            </li>
          ))}
        </ul>
      )}

      {/* Feedback form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Star rating input */}
        <div className="flex justify-center space-x-1 mb-4">
          {[...Array(5)].map((_, index) => (
            <span
              key={index}
              className={`text-3xl cursor-pointer ${
                index < rating ? "text-yellow-400" : "text-gray-300"
              }`}
              onClick={() => handleStarClick(index)}
            >
              ★
            </span>
          ))}
        </div>

        {/* Comment input */}
        <textarea
          placeholder="Comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full p-3 border rounded"
          required
        />

        {/* Appointment ID input */}
        <input
          type="text"
          placeholder="Appointment ID"
          value={appointmentId}
          onChange={(e) => setAppointmentId(e.target.value)}
          className="w-full p-3 border rounded"
          required
        />

        {/* Patient ID input */}
        <input
          type="text"
          placeholder="Patient ID"
          value={patientId}
          onChange={(e) => setPatientId(e.target.value)}
          className="w-full p-3 border rounded"
          required
        />

        {/* Submit button */}
        <button className="w-full bg-blue-500 text-white p-2 rounded">
          Submit
        </button>
      </form>
    </div>
  );
}
