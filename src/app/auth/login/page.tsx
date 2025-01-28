'use client';
import { ChangeEvent, FormEvent, useContext, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/app/AuthProvider";
import { AuthenticatedUser } from "@/lib/types";

export default function Login() {
  const { setAuthState } = useContext(AuthContext);
  const router = useRouter();
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCredentials((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };


  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:5148/api/auth/login",
        credentials,
        {
          withCredentials: true,
        }
      );

      console.log("response data == ", response.data)
      console.log("response data as authed user == ", response.data);
      if (response.status === 200) {
        const authenticatedUser: AuthenticatedUser = {} as AuthenticatedUser;
        authenticatedUser.isAuthenticated = true;
        authenticatedUser.roles = (response.data as AuthenticatedUser).roles;
        authenticatedUser.userId = (response.data as AuthenticatedUser).userId;
        authenticatedUser.username = (response.data as AuthenticatedUser).username;
        console.log("response data formatted authed user == ", authenticatedUser);
        setAuthState(authenticatedUser);
      }

      router.push("/");
    } catch (error) {
      console.error("Login failed: " + error);
      setError("Invalid username or password");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
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
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
