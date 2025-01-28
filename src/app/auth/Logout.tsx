import axios from "axios";

// button to handle logout

export default function Logout() {
  const handleLogout = () => {
    axios
      .post(
        "http://localhost:5148/api/auth/logout",
        {},
        {
          withCredentials: true,
        }
      )
      .then(() => {
        window.location.href = "/login";
      })
      .catch((error) => {
        console.error("Error logging out:", error);
      });
  };

  return <button onClick={handleLogout}>Logout</button>;
};
