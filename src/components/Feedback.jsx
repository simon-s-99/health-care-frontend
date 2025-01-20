import React, { useState, useEffect } from "react";
import axios from "axios";

export default function FeedbackList() {
  // State variables to store and manage feedback, form data, and application state.
  const [feedback, setFeedback] = useState([]);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [appointmentId, setAppointmentId] = useState("");
  const [patientId, setPatientId] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false); // Loading state while fetching data
  const [showFeedback, setShowFeedback] = useState(false); // Toggles visibility of feedback list
  const [page, setPage] = useState(1); // Tracks the current page for pagination
  const [hasMore, setHasMore] = useState(true); // Determines if there is more feedback to fetch

  // Fetch feedback data with pagination
  const fetchFeedback = async () => {
    setLoading(true); // Show the loading spinner while fetching data
    try {
      const response = await axios.get(
        `http://localhost:5148/api/feedback?page=${page}&pageSize=5`
      );

      if (response.data.length === 0) {
        setHasMore(false); // Stop fetching if no more feedback is available
      } else {
        setFeedback((prevFeedback) => [...prevFeedback, ...response.data]); // Append new feedback to the list
        setPage((prevPage) => prevPage + 1); // Increment the page number
      }
    } catch (err) {
      setError("Failed to fetch feedback"); 
      console.log(err);
    } finally {
      setLoading(false); // Stop the loading spinner after fetching
    }
  };

  // Fetch feedback only when the feedback list is toggled open
  useEffect(() => {
    if (showFeedback && feedback.length === 0) {
      fetchFeedback();
    }
  }, [showFeedback]); // Dependency ensures this only runs when `showFeedback` changes

  // Handle form submission for submitting feedback
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the page from refreshing
    setError(null); // Clear any previous errors

    try {
      const newFeedback = { appointmentId, patientId, comment, rating }; // Feedback payload

      const response = await axios.post(
        `http://localhost:5148/api/feedback`,
        newFeedback,
        { headers: { "Content-Type": "application/json" } }
      );

      // Add the new feedback to the top of the existing list
      setFeedback((prevFeedback) => [response.data, ...prevFeedback]);

      // Resets form inputs
      setComment("");
      setRating(0);
      setAppointmentId("");
      setPatientId("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create feedback");
    }
  };

  // Handle clicking on a star to set the rating
  const handleStarClick = (index) => {
    setRating(index + 1); // Set rating based on the clicked star
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-md">
      {/* Title for the feedback list */}
      <h2 className="text-xl font-semibold text-center mb-4">Share your experience</h2>

      {/* Display error messages */}
      {error && <p className="text-red-500 text-center">{error}</p>}

      {/* Feedback form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Star rating input */}
        <div className="flex justify-center space-x-1 mb-4">
          {[...Array(5)].map((_, index) => (
            <span
              key={index}
              aria-label={`Rate ${index + 1} stars`} // Accessibility improvement
              className={`text-3xl cursor-pointer ${
                index < rating ? "text-yellow-400" : "text-gray-300"
              }`}
              onClick={() => handleStarClick(index)}
            >
              ★
            </span>
          ))}
        </div>

        {/* Appointment ID input field */}
        <label className="block">
          <input
            type="text"
            placeholder="Enter Appointment ID"
            value={appointmentId}
            onChange={(e) => setAppointmentId(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </label>

        {/* Patient ID input field */}
        <label className="block">
          <input
            type="text"
            placeholder="Enter Patient ID"
            value={patientId}
            onChange={(e) => setPatientId(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </label>

        {/* Comment input field */}
        <label className="block">
          <textarea
            placeholder="Write your feedback here..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full p-3 border rounded"
            maxLength={500}
            required
          />
        </label>

        {/* Submit button */}
        <button className="w-full bg-blue-500 text-white p-2 rounded">
          Submit
        </button>
      </form>

      {/* Show feedback list toggle button */}
      <button
        onClick={() => setShowFeedback((prev) => !prev)}
        className="mt-4 w-full bg-gray-500 text-white p-2 rounded"
      >
        {showFeedback ? "Hide Reviews" : "Show Reviews"}
      </button>

      {/* Feedback list */}
      {showFeedback && (
        <div>
          <h2 className="text-lg font-semibold mt-6">User Reviews</h2>

          {/* Show loading spinner */}
          {loading ? (
            <p className="text-center text-gray-500">Loading...</p>
          ) : (
            <ul className="space-y-2 mb-6">
              {feedback.map((item) => (
                <li key={item.id} className="border p-3 rounded">
                  <p>{item.comment}</p>
                  <p className="text-gray-500 flex items-center">
                    {/* Display the rating as stars */}
                    {[...Array(item.rating)].map((_, starIndex) => (
                      <span key={starIndex} className="text-yellow-400 text-xl">
                        ★
                      </span>
                    ))}
                  </p>
                </li>
              ))}
            </ul>
          )}
          {/* Button to load more feedback */}
          {hasMore && !loading && (
            <button
              onClick={fetchFeedback}
              className="w-full bg-blue-500 text-white p-2 rounded"
            >
              Load More Reviews
            </button>
          )}
        </div>
      )}
    </div>
  );
}
