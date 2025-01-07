import axios from "axios";
// button to handle logout, you can change this as you want
// does not have to look or be like this but you can see how to use the logout call
const Logout = () => {
  const handleLogout = () => {
    axios
      .post(
        "http://localhost:5148/api/auth/logout",
        {},
        {
          withCredentials: true,
        }
      )
      .then((response) => {
        window.location.href = "/login";
      })
      .catch((error) => {
        console.error("Error logging out:", error);
      });
  };

  return <button onClick={handleLogout}>Logout</button>;
};

export default Logout;
