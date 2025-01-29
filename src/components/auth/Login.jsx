import { useState } from "react";
import axios from "axios";
import { useAuth } from "../../hooks/useAuth";
import { NavLink, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export default function Login() {
  const { setAuthState } = useAuth();
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    setCredentials((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:5148/api/auth/login",
        credentials,
        {
          withCredentials: true,
        }
      );

      console.log("Login successful:", JSON.stringify(response.data));

      const { loggedInUser, roles } = response.data;

      setAuthState({
        isAuthenticated: true,
        user: loggedInUser,
        roles: roles,
      });

      if (roles.includes("Admin") || roles.includes("User")) {
        navigate("/dashboard", { replace: true });
        window.location.reload();
      } else {
        console.error("Unauthorized access. No valid role found.");
        navigate("/unauthorized", { replace: true }); // Navigate to an unauthorized
      }

    } catch (error) {
      console.error("Login failed:", error.response || error);
      setError("Invalid username or password");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[90vh] bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-lg font-bold">Login</CardTitle>
        </CardHeader>
        <CardContent>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <Input
                id="username"
                name="username"
                type="text"
                value={credentials.username}
                onChange={handleInputChange}
                required
                placeholder="Enter your username"
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
                value={credentials.password}
                onChange={handleInputChange}
                required
                placeholder="Enter your password"
              />
            </div>
            <Button type="submit" className="w-full">
              Login
            </Button>
            <p className="text-center">Dont have an account?
              <Tooltip>
                <TooltipTrigger asChild>
                  <NavLink to="/register"
                    className="pl-1 text-blue-500 hover:underline decoration-blue-500"
                  >
                    Sign up now!
                  </NavLink>
                </TooltipTrigger>
                <TooltipContent className="bg-white">
                  <p className="text-black">Navigate to register page.</p>
                </TooltipContent>
              </Tooltip>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
