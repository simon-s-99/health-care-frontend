import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../hooks/useAuth";

const CaregiverAvailability = () => {
  const [availabilities, setAvailabilities] = useState([]); // Current availabilities
  const [newDate, setNewDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const API_URL = "http://localhost:5148/api/Availability";

  // Get caregiver Id from authState.
  const { authState, isLoading } = useAuth();
  const caregiverId = authState?.userId;

  // Fetch all availabilities for the caregiver
  const fetchAvailabilities = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get(`${API_URL}/all`, {
        withCredentials: true, // Include cookies for authentication
      });
      setAvailabilities(response.data || []);
    } catch (err) {
      setError("Failed to fetch availabilities. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Add a new availability
  const addAvailability = async () => {
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      if (!newDate) {
        setError("Please select a date and time.");
        return;
      }

      // Check for duplicate availabillites
      const isDuplicate = availabilities.some(
        (availability) =>
          Date.parse(availability.dateTime) === Date.parse(newDate)
        // new Date(availability.dateTime).getTime() ===
        // new Date(newDate).getTime()
      );

      if (isDuplicate) {
        setError("You already have availability set for this date and time.");
        return;
      }

      if (!caregiverId) {
        setError("Caregiver ID not found. Please log in again.");
        return;
      }

      await axios.post(
        API_URL,
        { caregiverId, dateTime: newDate },
        { withCredentials: true }
      );
      setSuccess("Availability added successfully!");
      setNewDate(""); // Clear input
      fetchAvailabilities(); // Refresh the list
    } catch (err) {
      setError(err.response?.data || "Failed to add availability.");
    } finally {
      setLoading(false);
    }
  };

  // Delete an availability
  const deleteAvailability = async (id) => {
    if (!window.confirm("Are you sure you want to delete this availability?")) {
      return; // Exit if the user cancels
    }

    setLoading(true);
    setError("");
    setSuccess("");
    try {
      await axios.delete(`${API_URL}?id=${id}`, { withCredentials: true });
      setSuccess("Availability deleted successfully!");
      fetchAvailabilities(); // Refresh the list
    } catch (err) {
      setError(err.response?.data || "Failed to delete availability.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch availabilities on component mount
  useEffect(() => {
    fetchAvailabilities();
  }, []);

  if (isLoading) {
    return <h2>Loading...</h2>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Set Your Available Times
        </h1>

        {/* Error Message */}
        {error && <p className="text-red-600 mb-4 text-center">{error}</p>}

        {/* Success Message */}
        {success && (
          <p className="text-green-600 mb-4 text-center">{success}</p>
        )}

        {/* Add New Availability */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Add New Availability</h2>
          <div className="flex items-center gap-4">
            <input
              type="datetime-local"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              className="border p-2 rounded-md w-full max-w-md"
            />
            <button
              onClick={addAvailability}
              className="bg-blue-500 text-white px-4 py-2 rounded-md"
              disabled={loading}
            >
              {loading ? "Adding..." : "Add"}
            </button>
          </div>
        </div>

        {/* List of Availabilities */}
        <div>
          <h2 className="text-lg font-semibold mb-2">Your Available Times</h2>
          {loading ? (
            <p className="text-center">Loading...</p>
          ) : (
            <ul className="list-disc pl-5">
              {availabilities.map((availability) => (
                <li
                  key={availability.id}
                  className="flex justify-between items-center mb-2"
                >
                  <span>
                    {new Date(availability.dateTime).toLocaleString()}
                  </span>
                  <button
                    onClick={() => deleteAvailability(availability.id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default CaregiverAvailability;
