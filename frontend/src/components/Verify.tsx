import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Check, Loader2, Lock, RefreshCcw } from "lucide-react";
import axios from "axios";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const OtpSchema = z.object({
  otp: z.string().min(6, { message: "Otp must be 6 digits" }),
});

const Verify = () => {
  const [Loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const email = localStorage.getItem("Verify-email");
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(OtpSchema),
    mode: "onChange",
  });

  useEffect(() => {
    const isVerified = localStorage.getItem("email-verified");
    if (isVerified === "true") return;

    if (!email) {
      navigate("/signup");
      return;
    }

    const storedTimestamp = localStorage.getItem("otpTimestamp");
    let expiryTime = storedTimestamp ? parseInt(storedTimestamp) : Date.now();

    const timeDiff = Math.floor((expiryTime + 600000 - Date.now()) / 1000);

    if (timeDiff <= 0) {
      localStorage.removeItem("Verify-email");
      localStorage.removeItem("otpTimestamp");
      navigate("/signup");
      return;
    }

    setTimeLeft(timeDiff);

    const interval = setInterval(() => {
      const secondsLeft = Math.floor((expiryTime + 600000 - Date.now()) / 1000);
      setTimeLeft(secondsLeft);

      if (secondsLeft <= 0) {
        clearInterval(interval);
        localStorage.removeItem("Verify-email");
        localStorage.removeItem("otpTimestamp");
        navigate("/signup");
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [email, navigate]);

  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const sec = (seconds % 60).toString().padStart(2, "0");
    return `${min}:${sec}`;
  };

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:3000/verify", {
        otp: data.otp,
        email,
      });

      if (res.status === 200) {
        toast.success("Email verified");
        localStorage.setItem("email-verified", "true");
        setTimeout(() => {
          localStorage.removeItem("Verify-email");
          localStorage.removeItem("otpTimestamp");
        }, 500);
        setLoading(false);
        navigate("/login");
      }
    } catch (error: any) {
      setLoading(false);
      if (error.response?.status === 400) {
        toast.error("Invalid or expired OTP");
      } else {
        toast.error("Verification failed");
      }
    }
  };

  const handleResendOtp = async () => {
    try {
      const res = await axios.post("http://localhost:3000/resend-otp", {
        email,
      });
      if (res.status === 200) {
        toast.success("OTP resent");
        const newTimestamp = Date.now();
        localStorage.setItem("otpTimestamp", newTimestamp.toString());
        setTimeLeft(600); // reset to 10 minutes
      }
    } catch (error) {
      toast.error("Failed to resend OTP");
    }
  };

  return (
    <>
      <main className="flex justify-center items-center h-[90vh]">
        <div className="w-[23rem] p-1.5 rounded shadow-2xl text-justify">
          <div className="flex flex-col text-justify p-3">
            <p>
              An OTP is sent to your email address. Please enter the OTP below
              and verify your email.
            </p>
            <p className="mb-3">
              <strong>This OTP is valid for only 10 minutes.</strong>
            </p>
          </div>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col justify-center items-center gap-2"
          >
            <div className="flex justify-center items-center p-1 rounded border">
              <Lock className="text-gray-500 text-sm" />
              <input
                className="p-3 outline-none"
                type="text"
                placeholder="Enter OTP"
                maxLength={6}
                {...register("otp")}
              />
              <Button
                className="border-none border-l-2"
                type="submit"
                variant="outline"
              >
                {Loading ? <Loader2 className="animate-spin" /> : <Check />}
                Verify
              </Button>
            </div>

            <div className="flex justify-around items-center w-[20rem]">
              <div>{formatTime(timeLeft)}</div>
              <Button
                type="button"
                className="border"
                variant="outline"
                onClick={handleResendOtp}
                disabled={timeLeft > 0}
              >
                <RefreshCcw />
                Resend
              </Button>
            </div>

            {errors.otp && (
              <p className="text-red-600 text-center">{errors.otp.message}</p>
            )}
          </form>
        </div>
      </main>
    </>
  );
};

export default Verify;
