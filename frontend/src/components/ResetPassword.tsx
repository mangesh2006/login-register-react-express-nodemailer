import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Lock, RotateCcw } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { Button } from "./ui/button";
import axios from "axios";
import { toast } from "react-toastify";

const PasswordSchema = z
  .object({
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" })
      .regex(/[a-z]/, {
        message: "Password must contain at least one lowercase",
      })
      .regex(/[A-Z]/, {
        message: "Password must contain at least one uppercase",
      })
      .regex(/[0-9]/, { message: "Password must contain at least one number" })
      .regex(/[@$#&*?!%]/, {
        message:
          "Password must contain at least one special character (e.g. @)",
      }),
    confirmPass: z.string(),
  })
  .refine((data) => data.password === data.confirmPass, {
    message: "Passwords do not match",
    path: ["confirmPass"],
  });

const ResetPassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(PasswordSchema),
    mode: "onChange",
  });
  const [Password, setPassword] = useState("");
  const [Loading, setLoading] = useState(false);
  const meetsUppercase = /[A-Z]/.test(Password);
  const meetsLowercase = /[a-z]/.test(Password);
  const meetsNumber = /\d/.test(Password);
  const meetsSpecial = /[@$!%*#?&]/.test(Password);
  const navigate = useNavigate();
  const email = localStorage.getItem("Email");

  const onSubmit = async (data: any) => {
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:3000/reset-password", {
        email,
        password: data.password,
      });

      if (res.status === 200) {
        toast.success("Password reset successfully");
        localStorage.removeItem("Email")
        navigate("/login");
      }
    } catch (error: any) {
      if (error.status === 500) {
        toast.error("Server error");
      } else if (error.status === 404) {
        toast.error("User not found");
        localStorage.removeItem("Email")
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
          className="flex flex-col justify-center items-center shadow-2xl p-10 rounded-xl gap-2"
        >
          <p className="text-2xl font-bold mb-2 -my-2">Reset Password</p>
          <div className="flex justify-center items-center gap-2 border rounded w-full">
            <Lock className="text-gray-500 ml-2" />
            <input
              className="p-3 outline-none w-full"
              type="password"
              placeholder="Enter new password"
              {...register("password")}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="bg-blue-300 rounded-xl text-md flex flex-col text-red-600 px-3 py-3 gap-2 font-bold max-h-[150px] overflow-y-auto w-full">
            <h4 className="text-red-600">Password Requirements:</h4>
            <ul className="list-disc pl-5">
              <li
                className={
                  Password.length >= 6 ? "text-green-600" : "text-red-600"
                }
              >
                {Password.length >= 6 ? "✅" : "❌"} Password lenght must be 6
                characters
              </li>
              <li
                className={meetsUppercase ? "text-green-600" : "text-red-600"}
              >
                {meetsUppercase ? "✅" : "❌"} At least 1 uppercase letter
              </li>
              <li
                className={meetsLowercase ? "text-green-600" : "text-red-600"}
              >
                {meetsLowercase ? "✅" : "❌"} At least 1 lowercase letter
              </li>
              <li className={meetsNumber ? "text-green-600" : "text-red-600"}>
                {meetsNumber ? "✅" : "❌"}At least 1 number
              </li>
              <li className={meetsSpecial ? "text-green-600" : "text-red-600"}>
                {meetsSpecial ? "✅" : "❌"} At least 1 special character (e.g.,
                @, $, !)
              </li>
            </ul>
          </div>
          <div className="flex justify-center items-center gap-2 border rounded w-full">
            <Lock className="text-gray-500 ml-2" />
            <input
              className="p-3 outline-none w-full"
              type="password"
              placeholder="Confirm password"
              {...register("confirmPass")}
            />
          </div>
          {errors.confirmPass && (
            <p className="text-red-600">{errors.confirmPass.message}</p>
          )}
          <Button variant={"outline"} className="border hover:bg-accent w-full">
            {Loading ? <Loader2 className="animate-spin" /> : <RotateCcw />}
            Reset Password
          </Button>
        </form>
      </main>
    </>
  );
};

export default ResetPassword;
