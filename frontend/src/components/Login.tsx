import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Lock, LogIn, Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "./ui/button";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";

const loginSchema = z.object({
  email: z
    .string({ message: "Username is required" })
    .email({ message: "please enter valid email" }),
  password: z
    .string({ message: "Password is required" })
    .min(6, { message: "Password must be at least 6 characters" }),
});

const Login = () => {
  const [Loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:3000/login", data);
      if (res.status === 200) {
        toast.success("Logged in successfully");
        localStorage.setItem("Verify-email", data.email);
        navigate("/welcome");
      }
    } catch (error: any) {
      if (error.status === 400) {
        toast.error("User not found");
      } else if (error.status === 403) {
        toast.info("User is not verified");
        localStorage.setItem("Verify-email", data.email);
        navigate("/verify");
      } else if (error.status === 401) {
        toast.error("Invalid password");
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
          <p className="text-2xl font-bold mb-2 -my-2">Login</p>
          <div className="flex justify-center items-center gap-2 border rounded">
            <Mail className="text-gray-500 mx-2" />
            <input
              className="outline-none p-2"
              type="email"
              placeholder="Enter email"
              {...register("email")}
            />
          </div>
          {errors.email && (
            <p className="text-red-600">{errors.email.message}</p>
          )}

          <div className="flex justify-center items-center gap-2 border rounded">
            <Lock className="text-gray-500 mx-2" />
            <input
              className="outline-none p-2"
              type="password"
              placeholder="Enter password"
              {...register("password")}
            />
          </div>
          {errors.password && (
            <p className="text-red-600">{errors.password.message}</p>
          )}
          <div className="mb-3 w-full">
            <Link to={"/forgot"}>Forgot Password?</Link>
          </div>
          <Button
            type="submit"
            variant={"outline"}
            className="border hover:bg-accent w-full"
          >
            {Loading ? <Loader2 className="animate-spin" /> : <LogIn />}
            Login
          </Button>
        </form>
      </main>
    </>
  );
};

export default Login;
