import { Loader2, Pencil, Save, User } from "lucide-react";
import { Button } from "./ui/button";
import {
  DialogContent,
  Dialog,
  DialogHeader,
  DialogTrigger,
} from "./ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import axios from "axios";
import { toast } from "react-toastify";
import { useState } from "react";

interface EditProfileDialogProps {
  username: string;
  setUsername: (name: string) => void;
}

const EditProfileDialog = ({
  username,
  setUsername,
}: EditProfileDialogProps) => {
  const [Username, setUpdatedUsername] = useState(username);
  const [open, setOpen] = useState(false);
  const [Loading, setLoading] = useState(false);
  const email = localStorage.getItem("Verify-email");

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:3000/edit-profile", {
        email,
        upd_username: Username,
      });

      if (res.status === 200) {
        toast.success("Profile Edited Successfully");
        setUsername(Username);
        setOpen(false);
      }
    } catch (error: any) {
      if (error.status === 404) {
        toast.error("User not found");
      } else if (error.status === 500) {
        toast.error("Server error");
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size={"lg"}
          variant={"outline"}
          className="border hover:bg-accent text-blue-400 hover:text-blue-500"
        >
          <Pencil />
          Edit Profile
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Edit Profile</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col justify-center gap-2"
        >
          <div className="flex justify-center items-center p-2 rounded border gap-2">
            <User className="text-gray-500" />
            <input
              className="outline-none w-full"
              type="text"
              placeholder="Edit Username"
              value={Username}
              onChange={(e) => setUpdatedUsername(e.target.value)}
            />
          </div>
          <Button
            type="submit"
            variant={"outline"}
            className="border hover:bg-accent"
            disabled={!Username.trim() || Username === username}
          >
            {Loading ? <Loader2 className="animate-spin" /> : <Save />}
            Save
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileDialog;
