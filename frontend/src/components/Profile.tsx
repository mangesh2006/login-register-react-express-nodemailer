import { KeyRoundIcon } from "lucide-react";
import { Button } from "./ui/button";
import WelcomeNavbar from "./WelcomeNavbar";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import EditProfileDialog from "./EditProfileDialog"; // adjust path if needed
import DeleteProfileDialog from "./DeleteProfileDialog";

const Profile = () => {
  const email = localStorage.getItem("Verify-email");
  const navigate = useNavigate();
  const [username, setUsername] = useState("");

  useEffect(() => {
    const fetchWelcome = async () => {
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

  return (
    <>
      <WelcomeNavbar />
      <main className="flex justify-center items-start pt-20 min-h-[90vh] bg-gray-100">
        <div className="shadow-2xl rounded-2xl w-full max-w-xl overflow-hidden bg-white">
          <div className="bg-blue-400 p-6">
            <h1 className="text-3xl font-bold text-white">Profile</h1>
          </div>
          <div className="flex justify-between items-center p-4">
            <p>Username</p>
            {username}
          </div>
          <hr className="bg-gray-800" />
          <div className="flex justify-between items-center p-4">
            <p>Email</p>
            {email}
          </div>
          <hr className="bg-gray-800" />
          <div className="p-6 flex justify-evenly items-center">
            <EditProfileDialog username={username} setUsername={setUsername} />
            <Button
              variant={"outline"}
              className="border text-orange-400 hover:text-orange-500 hover:bg-accent"
              size={"lg"}
              onClick={() => navigate("/forgot")}
            >
              <KeyRoundIcon />
              Change Password
            </Button>
            <DeleteProfileDialog/>
          </div>
        </div>
      </main>
    </>
  );
};

export default Profile;
