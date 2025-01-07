import styled from "styled-components";
import { useState } from "react";
import axios from "axios";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
// login page
const LoginContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

const LoginButton = styled.button`
  cursor: pointer;
  padding: 10px 30px;
  background-color: #057d7a;
  border-radius: 10px;
  font-size: 18px;
  font-weight: 600;
  color: #fff;
  margin-top: 40px;
  transition: background-color 0.3s ease, transform 0.2s ease,
    box-shadow 0.2s ease;
  text-align: center;
  border: none;

  &:hover {
    background-color: #2fadaa;
    transform: translateY(-3px);
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.15);
  }
`;

const Title = styled.h2`
  font-size: 22px;
`;

const FormWrapper = styled.form`
  padding: 40px;
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  border-radius: 15px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
  width: 350px;
  gap: 10px;
`;

const StyledInput = styled.input`
  font-size: 16px;
  border: 1px solid #ddd;
  background-color: #fafafa;
  border-radius: 5px;
  padding: 5px 0px;

  &:focus {
    outline: none;
  }
`;

function Login() {
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
    <LoginContainer>
      <Title>Login</Title>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <FormWrapper onSubmit={handleLogin}>
        <label>Username: </label>
        <StyledInput
          name="username"
          type="text"
          value={credentials.username}
          onChange={handleInputChange}
          required
        />
        <label>Password: </label>
        <StyledInput
          name="password"
          type="password"
          value={credentials.password}
          onChange={handleInputChange}
          required
        />
        <LoginButton type="submit">Login</LoginButton>
      </FormWrapper>
    </LoginContainer>
  );
}

export default Login;
