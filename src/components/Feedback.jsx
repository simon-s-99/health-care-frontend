import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../hooks/useAuth";

export default function FeedbackList() {
  // State variables to store and manage feedback, form data, and application state.
  const [feedback, setFeedback] = useState([]);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [appointmentId, setAppointmentId] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false); // Loading state while fetching data
  const [page, setPage] = useState(1); // Tracks the current page for pagination
  const [hasMore, setHasMore] = useState(true); // Determines if there is more feedback to fetch
  const [starDistribution, setStarDistribution] = useState({}); // Stores the number of reviews for each star rating

  // Fetch the logged-in user's information from authState
  const { authState } = useAuth();
  const patientId = authState?.userId;

  // Log authState and patientId whenever they change
  useEffect(() => {
    console.log("AuthState on mount:", authState);
    console.log("Extracted patientId:", patientId);
  }, [authState, patientId]);

  // Fetch the user's appointment ID
  useEffect(() => {
    const fetchAppointmentId = async () => {
      try {
        if (!patientId) {
          console.warn(
            "PatientId is missing; fetchAppointmentId will not be triggered."
          );
          return;
        }

        console.log("Fetching appointments for patientId:", patientId);
        const response = await axios.get(
          "http://localhost:5148/api/appointment/user",
          {
            params: { id: patientId },
            withCredentials: true
          }
        );
        console.log("Fetched appointment data:", response.data);

        if (response.data?.length > 0) {
          setAppointmentId(response.data[0].id);
          console.log("Set appointmentId:", response.data[0].id);
        } else {
          console.error(
            "No valid appointments found for patientId:",
            patientId
          );
          setError(
            "No valid appointments found. Please schedule an appointment first."
          );
        }
      } catch (err) {
        console.error("Error fetching appointment data:", err);
        setError("Failed to fetch appointment information.");
      }
    };

    fetchAppointmentId();
  }, [patientId]);

  // Fetch feedback data with pagination
  const fetchFeedback = async (reset = false) => {
    if (reset) {
      setFeedback([]); // Clear feedback list on reset
      setPage(1);
      setHasMore(true);
    }

    setLoading(true); // Show loading spinner
    try {
      const currentPage = reset ? 1 : page;
      console.log(`Fetching feedback for page ${currentPage}...`);
      const response = await axios.get(
        `http://localhost:5148/api/feedback?page=${currentPage}&pageSize=5`
      );
      console.log("Fetched feedback data:", response.data);

      if (response.data.length === 0) {
        setHasMore(false); // No more feedback available
      } else {
        const updatedFeedback = reset
          ? response.data // Replace list on reset
          : [...feedback, ...response.data]; // Append data otherwise

        setFeedback(updatedFeedback);
        calculateStarDistribution(updatedFeedback);
        setPage((prevPage) => prevPage + 1); // Increment page for next fetch
      }
    } catch (err) {
      console.error("Failed to fetch feedback:", err);
      setError("Failed to fetch feedback.");
    } finally {
      setLoading(false); // Hide loading spinner
    }
  };

  // Calculate the distribution of feedback by star ratings
  const calculateStarDistribution = (FeedbackList) => {
    console.log("Calculating star distribution...");
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }; // Initialize all ratings to 0
    FeedbackList.forEach((item) => {
      distribution[item.rating] = (distribution[item.rating] || 0) + 1; // Increment count for each rating
    });
    console.log("Updated star distribution:", distribution);
    setStarDistribution(distribution); // Update state with the calculated distribution
  };

  // Fetch initial feedback when the component mounts
  useEffect(() => {
    console.log("Triggering initial feedback fetch...");
    fetchFeedback(true); // Fetch feedback on component load
  }, []);

  // Handle feedback submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting feedback with:", {
      appointmentId,
      patientId,
      comment,
      rating,
    });

    if (!rating) {
      console.error("Rating is required to submit feedback.");
      setError("Please select a star rating before submitting feedback.");
      return;
    }

    if (!appointmentId || !patientId) {
      console.error("Missing appointmentId or patientId.");
      setError(
        "You need a valid appointment and patient ID to submit feedback."
      );
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5148/api/feedback",
        { appointmentId, patientId, comment, rating },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      console.log("Feedback submitted successfully:", response.data);

      // Add the new feedback to the top of the list
      setFeedback((prevFeedback) => [response.data, ...prevFeedback]);
      setComment(""); // Clear comment input
      setRating(0); // Reset rating
      calculateStarDistribution([response.data, ...feedback]); // Update star distribution
    } catch (err) {
      console.error("Failed to submit feedback:", err);
      setError("Failed to submit feedback.");
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-gray-50">
      {/* Feedback Form */}
      <div className="p-6 bg-white shadow-md rounded-md">
        <h2 className="text-xl font-semibold mb-4 text-center">
          Share Your Experience
        </h2>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex justify-center space-x-2">
            {[...Array(5)].map((_, index) => (
              <span
                key={index}
                aria-label={`Rate ${index + 1} stars`}
                className={`text-3xl cursor-pointer ${
                  index < rating ? "text-yellow-400" : "text-gray-300"
                }`}
                onClick={() => setRating(index + 1)}
              >
                ★
              </span>
            ))}
          </div>
          <textarea
            placeholder="Write your feedback here..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full p-3 border rounded"
            maxLength={500}
            required
          />
          <button
            disabled={!rating}
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Submit Feedback
          </button>
        </form>
      </div>

      {/* Feedback Statistics and Reviews */}
      <div className="p-6 bg-white shadow-md rounded-md mt-6">
        <h2 className="text-xl font-semibold mb-4 text-center">
          Feedback for Health care AB
        </h2>
        <ul className="space-y-4">
          {Object.entries(starDistribution)
            .sort((a, b) => b[0] - a[0]) // Sort stars by descending order
            .map(([stars, count]) => (
              <li key={stars} className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-yellow-400 text-lg">★</span>
                  <span className="ml-2 text-lg">{stars} Stars</span>
                </div>
                <span>{count}</span>
              </li>
            ))}
        </ul>
        <h3 className="text-lg font-semibold mt-6">Reviews</h3>
        <ul className="space-y-4">
          {feedback.map((item) => (
            <li key={item.id} className="p-3 bg-gray-100 rounded-md">
              <p className="font-medium">{item.comment}</p>
              <div className="flex space-x-1">
                {[...Array(item.rating)].map((_, starIndex) => (
                  <span key={starIndex} className="text-yellow-400 text-lg">
                    ★
                  </span>
                ))}
              </div>
            </li>
          ))}
        </ul>
        {hasMore ? (
          <button
            onClick={() => fetchFeedback(false)}
            className="mt-4 w-full bg-gray-300 text-black p-2 rounded hover:bg-gray-400"
          >
            Show More Reviews
          </button>
        ) : (
          <p className="text-center mt-4 text-gray-500">
            No more reviews to load.
          </p>
        )}
      </div>
    </div>
  );
}
