import "./index.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import AuthProvider from "./context/AuthContext";
import Register from "./components/Register";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import Unauthorized from "./components/Unauthorized";
import Home from "./components/Home";
import RequireAuth from "./components/RequireAuth";
import FeedbackList from "./components/Feedback";
import NavBar from "./components/NavBar";
import BookingsPage from "./components/BookingsPage";
import Profile from "./components/Profile";

export default function App() {
  return (
    <AuthProvider>
      <div className="content">
        <Router>
          <NavBar />
          <Routes>
            <Route path="/Profile" element={<Profile />} />
            <Route path="/feedback" element={<FeedbackList />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route
              path="/dashboard"
              element={
                <RequireAuth allowedRoles={["User", "Admin"]}>
                  <Dashboard />
                </RequireAuth>
              }
            />
            <Route
              path="/booking"
              element={
                <RequireAuth allowedRoles={["User"]}>
                  <BookingsPage />
                </RequireAuth>
              }
            />
            <Route path="/" element={<Home />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </div>
    </AuthProvider>
  );
}
