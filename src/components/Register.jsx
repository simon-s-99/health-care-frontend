import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export default function Register() {
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phonenumber: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    setUserDetails((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (userDetails.password !== userDetails.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5148/api/auth/register",
        {
          Firstname: userDetails.firstname,
          Lastname: userDetails.lastname,
          Email: userDetails.email,
          Phonenumber: userDetails.phonenumber,
          username: userDetails.username,
          password: userDetails.password,
          roles: ["User"]
        },
      );
      

      console.log("Registration successful:", response.data);
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Registration failed:", error.response || error);
      setError("Registration failed. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Register</CardTitle>
        </CardHeader>
        <CardContent>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <form className="space-y-4" onSubmit={handleRegister}>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                First Name
              </label>
              <Input
                name="firstname"
                type="text"
                value={userDetails.firstname}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Last Name
              </label>
              <Input
                name="lastname"
                type="text"
                value={userDetails.lastname}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <Input
                name="email"
                type="email"
                value={userDetails.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <Input
                name="phonenumber"
                type="tel"
                value={userDetails.phonenumber}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <Input
                name="username"
                type="text"
                value={userDetails.username}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <Input
                name="password"
                type="password"
                value={userDetails.password}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <Input
                name="confirmPassword"
                type="password"
                value={userDetails.confirmPassword}
                onChange={handleInputChange}
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Register
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
