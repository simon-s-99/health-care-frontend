'use client';
import { ChangeEvent, FormEvent, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Register() {
  // const navigate = useNavigate();
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

// Updates the userDetails state with the input field's value.
// This function is triggered whenever an input field changes.
// It uses the "name" attribute of the input field to determine which property of the userDetails object to update.
  function handleInputChange(e: ChangeEvent<HTMLInputElement>) {

    const inputValue = e.target.value;
    const inputName = e.target.name;

    setUserDetails((prev) => ({ ...prev, [inputName]: inputValue }));
  };

  async function handleRegister(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (userDetails.password !== userDetails.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5148/api/auth/register",
        {
          firstname: userDetails.firstname,
          lastname: userDetails.lastname,
          email: userDetails.email,
          phonenumber: userDetails.phonenumber,
          username: userDetails.username,
          password: userDetails.password,
          roles: ["User"]
        },
      );
          
      console.log("Registration successful:", response.data);
      // navigate("/login", { replace: true });
    } catch (error) {
      
      if (error) {
        setError("Registration failed. Please try again.");
        console.error(error)
      }
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
          <form className="space-y-4" onSubmit={(e) => handleRegister(e)}>
            <div>
              <label htmlFor ="firstname" className="block text-sm font-medium text-gray-700">
                First Name
              </label>
              <Input
                id="firstname"
                name="firstname"
                type="text"
                value={userDetails.firstname}
                onChange={(e) => handleInputChange(e)}
                required
              />
            </div>
            <div>
              <label htmlFor="lastname" className="block text-sm font-medium text-gray-700">
                Last Name
              </label>
              <Input
                id="lastname"
                name="lastname"
                type="text"
                value={userDetails.lastname}
                onChange={(e) => handleInputChange(e)}
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                value={userDetails.email}
                onChange={(e) => handleInputChange(e)}
                required
              />
            </div>
            <div>
              <label htmlFor="phonenumber" className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <Input
                id="phonenumber"
                name="phonenumber"
                type="tel"
                value={userDetails.phonenumber}
                onChange={(e) => handleInputChange(e)}
                required
              />
            </div>
            <div>
              <label htmlFor ="username" className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <Input
                id="username"
                name="username"
                type="text"
                value={userDetails.username}
                onChange={(e) => handleInputChange(e)}
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                value={userDetails.password}
                onChange={(e) => handleInputChange(e)}
                required
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={userDetails.confirmPassword}
                onChange={(e) => handleInputChange(e)}
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
