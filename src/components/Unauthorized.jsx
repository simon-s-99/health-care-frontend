import { useNavigate } from "react-router-dom";
// unauthorized page that shows if a user tries to access a page and does
// not have the correct role for it

export default function Unauthorized() {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1); // navigate back to the previous page
  };

  return (
    <div>
      <h2>Unauthorized</h2>
      <p>You do not have permission to view this page.</p>
      <button onClick={goBack}>Go Back</button>
    </div>
  );
}