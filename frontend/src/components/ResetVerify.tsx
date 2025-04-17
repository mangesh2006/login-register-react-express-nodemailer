import { Check, KeyRoundIcon, Loader2, RotateCcw } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const OtpSchema = z.object({
  otp: z
    .string({ message: "Otp is required" })
    .min(6, { message: "Otp must be 6 digit" }),
});

const ResetVerify = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(OtpSchema),
  });
  const navigate = useNavigate();
  const email = localStorage.getItem("Email");

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:3000/reset-verify", {
        otp: data.otp,
        email,
      });
      if (res.status === 200) {
        toast.success("Email Verified");
        navigate("/reset-password");
      }
    } catch (error: any) {
      if (error.status === 500) {
        toast.error("Server error");
      } else if (error.status === 400) {
        toast.error("Invalid or expired otp");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      const res = await axios.post("http://localhost:3000/resend-otp", {
        email,
      });
      if (res.status === 200) {
        toast.success("Otp resend");
      }
    } catch (error: any) {
      if (error.status === 500) {
        toast.error("Server error");
      }
    }
  };

  const [Loading, setLoading] = useState(false);
  return (
    <>
      <main className="flex justify-center items-center h-[90vh]">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col justify-center items-center p-5 shadow-2xl rounded-lg gap-2"
        >
          <p className="text-2xl font-bold mb-2 -my-2">Reset Password</p>
          <p>An otp sent on your email.</p>
          <div className="flex justify-center items-center gap-2 p-3 border rounded">
            <KeyRoundIcon className="text-gray-500" />
            <input
              type="text"
              placeholder="Enter otp"
              className="outline-none w-full"
              {...register("otp")}
              maxLength={6}
            />
          </div>
          <div className="flex justify-between items-center w-full">
            <Button type="button" variant={"outline"} onClick={handleResend}>
              {Loading ? <Loader2 className="animate-spin" /> : <RotateCcw />}
              Resend otp
            </Button>
          </div>
          {errors.otp && <p className="text-red-600">{errors.otp.message}</p>}
          <Button
            type="submit"
            variant={"outline"}
            className="border hover:bg-accent w-full"
          >
            {Loading ? <Loader2 className="animate-spin" /> : <Check />}
            Verify
          </Button>
        </form>
      </main>
    </>
  );
};

export default ResetVerify;
