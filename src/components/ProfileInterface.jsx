import React, { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import axios from "axios";
import InputField from "@/components/InputField";
import { Prompt } from "react-router-dom";

const Profile = () => {
  // Loading states
  const [isDirty, setIsDirty] = useState(false); // Tracks if there have been any inputs in the edit fields
  const [isLoading, setIsLoading] = useState(true); // Indicates whether data is being loaded
  const [isSavingAccount, setIsSavingAccount] = useState(false); // Indicates if account update is in progress
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [error, setError] = useState("");

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
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get("/api/auth/profile");
        setAccount({
          firstname: response.data.firstname,
          lastname: response.data.lastname,
          email: response.data.email,
          phonenumber: response.data.phonenumber,
          username: response.data.username,
        });
      } catch (err) {
        console.error("Failed to fetch user data:", err);
        setError("Failed to load profile data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []); // empty dependency array ensures this runs only once on component mount

  const handleAccountChange = (e) => {
    setAccount({ ...account, [e.target.name]: e.target.value });
    setIsDirty(true);
  };

  // Save the updated details
  const saveAccountDetails = async () => {
    setIsSavingAccount(true); // Indicate that the account update is in progress
    setError(""); // Reset error state
    try {
      const response = await axios.patch("/api/auth/update", account);
      setIsDirty(false);

      if (response.status === 200) {
        alert(response.data.message || "Profile updated successfully!");
      } else {
        alert("Something went wrong while updating the profile.");
      }
    } catch (error) {
      console.error("Failed to update profile:", error);
      alert("Failed to update profile.");
    } finally {
      setIsSavingAccount(false);
    }
  };

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (isDirty) {
        event.preventDefault();
        event.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isDirty]);

  // Change the users password
  const changePassword = async () => {
    setIsChangingPassword(true);
    try {
      if (passwords.newPassword !== passwords.confirmPassword) {
        setError("New password and confirmation do not match.");
        return;
      }

      // Send a request to the server to change the password
      const response = await axios.patch("/api/auth/change-password", {
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      });

      if (response.status === 200) {
        alert(response.data.message || "Password changed successfully!");
      } else {
        alert("Unexpected error while changing the password.");
      }
    } catch (error) {
      console.error("Failed to change password:", error);
      alert("Failed to change password.");
    } finally {
      setIsChangingPassword(false);
    }
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <main className="max-w-3x1 mx-auto mt-10 p-4">
      <Prompt
        when={isDirty}
        message="You have unsaved changes. Are you sure you want to leave?"
      />

      {/* ShadCN Tabs Component */}
      <section aria-labelledby="profile-tabs">
        <Tabs defaultValue="account" className="w-full">
          {/* Tabs List: Switch between Account and Password tabs */}
          <nav aria-label="Profile Tabs">
            <TabsList>
              <TabsTrigger value="account">Account</TabsTrigger>
              <TabsTrigger value="password">Password</TabsTrigger>
            </TabsList>
          </nav>

          {/* Account Tab */}
          <TabsContent value="account">
            <section aria-labelledby="account-section">
              <h2 id="account-section" className="text-lg font-semibold">
                Account
              </h2>
              {error && <p className="text-red-600">{error}</p>}
              {/*Error message*/}
              <form className="flex flex-col gap-4">
                {/* First Name Input */}
                <InputField
                  label="First Name"
                  id="firstname"
                  value={account.firstname}
                  onChange={handleAccountChange}
                  required={true}
                />

                {/* Last Name Input */}
                <InputField
                  label="Last Name"
                  id="lastname"
                  value={account.lastname}
                  onChange={handleAccountChange}
                  required={true}
                />

                {/* Email Input */}
                <InputField
                  label="Email"
                  id="email"
                  type="email"
                  value={account.email}
                  onChange={handleAccountChange}
                  required={true}
                />

                {/* Phone Number Input */}
                <InputField
                  label="Phone Number"
                  id="phonenumber"
                  type="tel"
                  value={account.phonenumber}
                  onChange={handleAccountChange}
                  required={true}
                />

                {/* Username Input */}
                <InputField
                  label="Username"
                  id="username"
                  value={account.username}
                  onChange={handleAccountChange}
                  required={true}
                />

                {/* Save Changes Button */}
                <button
                  type="button"
                  onClick={saveAccountDetails}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md"
                  disabled={isSavingAccount}
                >
                  {isSavingAccount ? "Saving..." : "Save Changes"}
                </button>
              </form>
            </section>
          </TabsContent>

          {/* Password Tab */}
          <TabsContent value="password">
            <section aria-labelledby="password-section">
              <h2 id="password-section" className="text-lg font-semibold">
                Password
              </h2>
              {error && <p className="text-red-600">{error}</p>}
              {/* Display error */}
              <form className="flex flex-col gap-4">
                {/* Current Password Input */}
                <div>
                  <label
                    className="block text-sm font-medium"
                    htmlFor="currentPassword"
                  >
                    Current Password
                  </label>
                  <input
                    id="currentPassword"
                    type="password"
                    name="currentPassword"
                    value={passwords.currentPassword}
                    onChange={handlePasswordChange}
                    className="w-full p-2 border rounded-md"
                  />
                </div>
                {/* New Password Input */}
                <div>
                  <label
                    className="block text-sm font-medium"
                    htmlFor="newPassword"
                  >
                    New Password
                  </label>
                  <input
                    id="newPassword"
                    type="password"
                    name="newPassword"
                    value={passwords.newPassword}
                    onChange={handlePasswordChange}
                    className="w-full p-2 border rounded-md"
                  />
                </div>
                {/* Confirm New Password Input */}
                <div>
                  <label
                    className="block text-sm font-medium"
                    htmlFor="confirmPassword"
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
                  />
                </div>
                {/* Change Password Button */}
                <button
                  type="button"
                  onClick={changePassword}
                  className="px-4 py-2 bg-green-500 text-white rounded-md"
                  disabled={isChangingPassword}
                >
                  {isChangingPassword ? "Changing..." : "Change Password"}
                </button>
              </form>
            </section>
          </TabsContent>
        </Tabs>
      </section>
    </main>
  );
};

export default Profile;
