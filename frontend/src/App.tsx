import "./App.css";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Navbar from "./components/Navbar";
import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./components/Home";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import Verify from "./components/Verify";
import Welcome from "./components/Welcome";
import Forgot from "./components/Forgot";
import ResetVerify from "./components/ResetVerify";
import ResetPassword from "./components/ResetPassword";
import Profile from "./components/Profile";

function App() {
  const location = useLocation();
  const hideNavbar = [
    "/welcome",
    "/forgot",
    "/reset-password",
    "/reset-verify",
    "/profile",
  ].includes(location.pathname);
  return (
    <>
      <header>{!hideNavbar && <Navbar />}</header>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/forgot" element={<Forgot />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/reset-verify" element={<ResetVerify />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
      <ToastContainer position="bottom-right" autoClose={2000} />
    </>
  );
}

export default App;
