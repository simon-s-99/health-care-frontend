import { useState } from "react";
import axios from "axios";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
// login page

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
          // using withCredentials is crutial for and request that needs to check authorization!
          // so remember to user this if neede
        }
      );

      console.log("Login successful:", JSON.stringify(response.data));
      // log response data

      const { loggedInUser, roles } = response.data;

      setAuthState({
        isAuthenticated: true,
        user: loggedInUser,
        roles: roles,
      });

      if (roles.includes("Admin")) {
        console.log("admin role");
        navigate("/admin/dashboard", { replace: true });
      } else {
        console.log("user");
        navigate("/user/dashboard", { replace: true });
      }
    } catch (error) {
      console.error("Login failed:", error.response || error);
      setError("Invalid username or password");
    }
  };

  return (
    <div>
      <h2>Login</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleLogin}>
        <label>Username: </label>
        <input
          name="username"
          type="text"
          value={credentials.username}
          onChange={handleInputChange}
          required
        />
        <label>Password: </label>
        <input
          name="password"
          type="password"
          value={credentials.password}
          onChange={handleInputChange}
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}