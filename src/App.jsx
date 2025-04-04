import "./index.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import AuthProvider from "./context/AuthContext";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import Dashboard from "./components/Dashboard";
import Unauthorized from "./components/auth/Unauthorized";
import Home from "./components/Home";
import RequireAuth from "./components/auth/RequireAuth";
import FeedbackList from "./components/Feedback";
import NavBar from "./components/navigation/NavBar";
import NavBarMobile from "./components/navigation/NavBarMobile";
import BookingsPage from "./components/booking/BookingsPage";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip"

export default function App() {
  return (
    <AuthProvider>
      <TooltipProvider>
        <div className="content">
          <Router>

            <nav className="max-md:hidden">
              <NavBar />
            </nav>
            <nav className="md:hidden">
              <NavBarMobile />
            </nav>

            <Routes>
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
              {/* Booking Pages for Patients & Admins */}
              <Route
                path="/booking/user"
                element={
                  <RequireAuth allowedRoles={["User"]}>
                    <BookingsPage />
                  </RequireAuth>
                }
              />

              <Route
                path="/booking/admin"
                element={
                  <RequireAuth allowedRoles={["Admin"]}>
                    <BookingsPage isCaregiverView={true} />
                  </RequireAuth>
                }
              />
              <Route path="/" element={<Home />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
        </div>
      </TooltipProvider>
    </AuthProvider>
  );
}
