import React, { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import axios from "axios";
import InputField from "@/components/profile/InputField";
import { Button } from "../ui/button";

const Profile = () => {
  // Loading states
  const [isDirty, setIsDirty] = useState(false); // Tracks if there have been any inputs in the edit fields
  const [isLoading, setIsLoading] = useState(true); // Indicates whether data is being loaded
  const [isSavingAccount, setIsSavingAccount] = useState(false); // Indicates if account update is in progress
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [error, setError] = useState("");
  const [successAccount, setSuccessAccount] = useState("");
  const [successPassword, setSuccessPassword] = useState("");

  // Account details
  const [account, setAccount] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phonenumber: "",
    username: "",
  });

  // Password update
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Fetch the user data

  // The || "" ensures that if any of the values are null, undefined, or otherwise "falsy," it falls back to an empty string.
  // It ensures the UI won't crash if the backend unexpectedly doesn't send a specific field (e.g. firstname is missing)
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5148/api/Auth/profile",
          {
            withCredentials: true, // send cookies (jwt)
          }
        );
        setAccount({
          firstname: response.data.firstname || "",
          lastname: response.data.lastname || "",
          email: response.data.email || "",
          phonenumber: response.data.phonenumber || "",
          username: response.data.username || "",
        });
      } catch (err) {
        console.error("Failed to fetch user data:", err.response || err);
        setError("Failed to load profile data. Please log in again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []); // empty dependency array ensures this runs only once on component mount

  const handleAccountChange = (e) => {
    setAccount({ ...account, [e.target.name]: e.target.value });
    setIsDirty(true); // Mark form as dirty if changes are made
  };

  const handlePasswordChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  // Save the updated details
  const saveAccountDetails = async () => {
    setIsSavingAccount(true); // Indicate that the account update is in progress
    setError(""); // Reset error state
    setSuccessAccount("");
    setSuccessPassword("");
    try {
      const response = await axios.patch(
        "http://localhost:5148/api/Auth/Update",
        account,
        {
          withCredentials: true, // Ensure cookies (jwt) are sent
        }
      );

      setIsDirty(false);

      if (response.status === 200) {
        setError("");
        setSuccessAccount(
          response.data.message || "Profile updated successfully!"
        );
      }
    } catch (error) {
      console.error("Error updating profile:", error.response?.data || error);
      const errorMessage =
        error.response?.data?.errors?.join(", ") || "Failed to update profile.";
      setError(errorMessage); // Display the errors in the UI
    } finally {
      setIsSavingAccount(false);
    }
  };

  /// Warn user before leaving the page if there are unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (isDirty) {
        event.preventDefault();
        event.returnValue = ""; // Display browser confirmation dialog
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload); // Cleanup on unmount
    };
  }, [isDirty]);

  // Change the users password
  const changePassword = async () => {
    setIsChangingPassword(true);
    setError(""); // Clear any previous errors
    setSuccessPassword("");
    setSuccessAccount("");

    try {
      if (passwords.newPassword !== passwords.confirmPassword) {
        setError("New password and confirmation do not match.");
        return;
      }

      if (!passwords.newPassword || !passwords.confirmPassword) {
        setError("New password and confirmation password are required.");
        return;
      }

      // Send a request to the server to change the password
      const response = await axios.post(
        "http://localhost:5148/api/Auth/change-password",
        {
          currentPassword: passwords.currentPassword,
          newPassword: passwords.newPassword,
          confirmPassword: passwords.confirmPassword,
        },
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        setError(""); // Clear any errors
        setSuccessPassword(
          response.data.message || "Password changed successfully!"
        );
      } else {
        setError("Unexpected error while changing the password.");
      }
    } catch (error) {
      console.error("Error changing password:", error.response?.data || error);

      // Extract the error message from the server response, if available
      const errorMessage =
        error.response?.data ||
        error.response?.data?.message ||
        "Failed to change password.";
      setError(errorMessage); // Display the specific error message to the user
    } finally {
      setIsChangingPassword(false); // End the loading state
    }
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <section className="mt-4 rounded-lg">
      <Tabs defaultValue="account">
        {/* Tabs List */}
        <nav aria-label="Profile Tabs" className="text-center">
          <TabsList className="justify-center">
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="password">Password</TabsTrigger>
          </TabsList>
        </nav>

        {/* display unchanged/unsaved message to user if they have made changes */}
        {isDirty &&
          <p className="mb-1 mt-4 flex flex-col">
            <em className="mx-auto">Careful! You have unsaved changes.</em>
          </p>
        }

        {/* Account Tab */}
        <TabsContent value="account">
          <section aria-labelledby="account-section" className="text-center">
            <h2 id="account-section" className="text-lg font-semibold my-4">
              Account
            </h2>
            {error && <p className="text-red-600 mb-2">{error}</p>}
            {successAccount && (
              <p className="text-green-600 mb-2">{successAccount}</p>
            )}
            <form className="flex flex-col gap-y-4">
              {/* First Name Input */}
              <InputField
                label="First Name"
                id="firstname"
                value={account.firstname}
                onChange={handleAccountChange}
                required={true}
                className="w-full"
              />

              {/* Last Name Input */}
              <InputField
                label="Last Name"
                id="lastname"
                value={account.lastname}
                onChange={handleAccountChange}
                required={true}
                className="w-full"
              />

              {/* Email Input */}
              <InputField
                label="Email"
                id="email"
                type="email"
                value={account.email}
                onChange={handleAccountChange}
                required={true}
                className="w-full"
              />

              {/* Phone Number Input */}
              <InputField
                label="Phone Number"
                id="phonenumber"
                type="tel"
                value={account.phonenumber}
                onChange={handleAccountChange}
                required={true}
                className="w-full"
              />

              {/* Username Input */}
              <InputField
                label="Username"
                id="username"
                value={account.username}
                onChange={handleAccountChange}
                required={true}
                className="w-full"
              />

              {/* Save Changes Button */}
              <Button onChange={saveAccountDetails} className="bg-green-500 hover:bg-blue-500">
                {isSavingAccount ? "Saving..." : "Save Changes"}
              </Button>
            </form>
          </section>
        </TabsContent>

        {/* Password Tab */}
        <TabsContent value="password">
          <section aria-labelledby="password-section" className="text-center">
            <h2 id="password-section" className="text-lg font-semibold my-4">
              Password
            </h2>

            {/* Error and Success Messages */}
            {error && <p className="text-red-600 mb-2">{error}</p>}
            {successPassword && (
              <p className="text-green-600 mb-2">{successPassword}</p>
            )}

            <form className="flex flex-col gap-y-4 items-center">
              {/* Current Password Input */}
              <div className="w-full max-w-md">
                <label
                  htmlFor="currentPassword"
                  className="block text-sm font-medium mb-1"
                >
                  Current Password
                </label>
                <input
                  id="currentPassword"
                  type="password"
                  name="currentPassword"
                  value={passwords.currentPassword}
                  onChange={handlePasswordChange}
                  className="w-full border rounded-md p-2"
                  autoComplete="current-password"
                />
              </div>

              {/* New Password Input */}
              <div className="w-full max-w-md">
                <label
                  htmlFor="newPassword"
                  className="block text-sm font-medium mb-1"
                >
                  New Password
                </label>
                <input
                  id="newPassword"
                  type="password"
                  name="newPassword"
                  value={passwords.newPassword}
                  onChange={handlePasswordChange}
                  className="w-full border rounded-md p-2"
                  autoComplete="new-password"
                />
              </div>

              {/* Confirm New Password Input */}
              <div className="w-full max-w-md">
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium mb-1"
                >
                  Confirm New Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  name="confirmPassword"
                  value={passwords.confirmPassword}
                  onChange={handlePasswordChange}
                  className="w-full p-2 border rounded-md"
                  autoComplete="new-password"
                />
              </div>

              {/* Change Password Button */}
              <Button onChange={handlePasswordChange} className="bg-green-500 w-full mt-4 hover:bg-blue-500">
                {isChangingPassword ? "Changing..." : "Change Password"}
              </Button>
            </form>
          </section>
        </TabsContent>
      </Tabs>
    </section>
  );
};

export default Profile;
