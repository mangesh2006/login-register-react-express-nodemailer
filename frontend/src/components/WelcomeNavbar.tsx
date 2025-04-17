import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { LogOutIcon } from "lucide-react";
import { toast } from "react-toastify";

const WelcomeNavbar = () => {
  const [username, setUsername] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWelcome = async () => {
      const email = localStorage.getItem("Verify-email");

      if (!email) {
        navigate("/login");
        return;
      }

      try {
        const res = await axios.post("http://localhost:3000/welcome", {
          email,
        });
        if (res.status === 200) {
          setUsername(res.data.username);
        }
      } catch (error: any) {
        if (error.response?.status === 400) {
          navigate("/login");
        } else {
          console.error("Server error", error);
        }
      }
    };

    fetchWelcome();
  }, []);

  const handleLogOut = async () => {
    const email = localStorage.getItem("Verify-email");

    if (!email) {
      toast.error("No email found for logout");
      return;
    }

    try {
      const res = await axios.post("http://localhost:3000/logout", {
        email,
      });
      if (res.status === 200) {
        toast.info("Logged out");
        localStorage.removeItem("Verify-email");
        localStorage.removeItem("email-verified");
        navigate("/login");
      }
    } catch (error: any) {
      if (error.response?.status === 500) {
        toast.error("Server error");
      } else if (error.response?.status === 404) {
        toast.error("Invalid email for logout");
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  };

  return (
    <>
      <header>
        <nav className="p-5 flex justify-between items-center bg-blue-600 text-white">
          <p className="text-xl">Welcome, {username}</p>
          <div className="flex justify-center items-center gap-4 text-xl">
            <ul className="flex justify-center items-center gap-4">
              <li>
                <Link to={"/welcome"}>Home</Link>
              </li>
              <li>
                <Link to={"/profile"}>Profile</Link>
              </li>
            </ul>
            <Button
              variant={"outline"}
              className="border"
              size={"lg"}
              onClick={handleLogOut}
            >
              <LogOutIcon />
              Logout
            </Button>
          </div>
        </nav>
      </header>
    </>
  );
};

export default WelcomeNavbar;
