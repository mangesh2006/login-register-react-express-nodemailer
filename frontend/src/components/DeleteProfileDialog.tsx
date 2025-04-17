import { DialogTitle } from "@radix-ui/react-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Check, Trash2, X } from "lucide-react";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const DeleteProfileDialog = () => {
  const [open, setopen] = useState(false);
  const email = localStorage.getItem("Verify-email");
  const navigate = useNavigate();

  const handleDelete = async (e: any) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:3000/delete-profile", {
        email,
      });

      if (res.status === 200) {
        toast.success("Profile deleted");
        localStorage.removeItem("Verify-email");
        setopen(false);
        navigate("/login");
      }
    } catch (error: any) {
      if (error.status === 404) {
        toast.error("User not found");
      } else {
        toast.error("Server error");
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={setopen}>
      <DialogTrigger>
        <Button
          variant={"outline"}
          size={"lg"}
          className="border hover:bg-accent text-red-500 hover:text-red-600"
        >
          <Trash2 />
          Delete Profile
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-red-600">
            Delete Profile
          </DialogTitle>
        </DialogHeader>
        <DialogDescription className="text-[1rem] text-black">
          Do you really want to delete this profile?
        </DialogDescription>
        <div className="flex justify-around items-center">
          <Button
            variant={"outline"}
            size={"lg"}
            className="border hover:bg-accent"
            onClick={handleDelete}
          >
            <Check />
            Yes
          </Button>
          <Button
            variant={"outline"}
            size={"lg"}
            className="border hover:bg-accent"
            onClick={() => setopen(false)}
          >
            <X />
            No
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteProfileDialog;
