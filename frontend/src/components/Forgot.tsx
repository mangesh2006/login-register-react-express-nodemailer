import { Check, Loader2, Mail } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const EmailSchema = z.object({
  email: z
    .string({ message: "Otp is required" })
    .email({ message: "Please enter valid email" }),
});

const Forgot = () => {
  const [Loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(EmailSchema),
  });

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:3000/forgot", data);
      if (res.status === 200) {
        toast.success("Otp sent on your email");
        localStorage.setItem("Email", data.email);
        navigate("/reset-verify");
      }
    } catch (error: any) {
      if (error.error === 404) {
        toast.error("User not found");
        localStorage.removeItem("Email")
      } else if (error.status === 500) {
        toast.error("Server error");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <main className="flex justify-center items-center h-[90vh]">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col justify-center items-center rounded-lg shadow-2xl p-5 gap-2"
        >
          <div className="w-[15.5rem]">
            <p>Please verify your email before resetting the password.</p>
          </div>
          <div className="flex justify-center items-center gap-2 border rounded">
            <Mail className="text-gray-500 mx-2" />
            <input
              className="outline-none p-2"
              type="email"
              placeholder="Enter email"
              {...register("email")}
            />
          </div>
          {errors && <p className="text-red-600">{errors.email?.message}</p>}
          <Button
            type="submit"
            variant={"outline"}
            className="border hover:bg-accent w-[15.5rem]"
          >
            {Loading ? <Loader2 className="animate-spin" /> : <Check />}
            Verify
          </Button>
        </form>
      </main>
    </>
  );
};

export default Forgot;
