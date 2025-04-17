import validations from "@/Schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { User2Icon, MailIcon, Lock, Check, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [Password, setPassword] = useState("");
  const [Loading, setLoading] = useState(false);
  const meetsUppercase = /[A-Z]/.test(Password);
  const meetsLowercase = /[a-z]/.test(Password);
  const meetsNumber = /\d/.test(Password);
  const meetsSpecial = /[@$!%*#?&]/.test(Password);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(validations),
    mode: "onChange",
  });

  const onsubmit = async (data: any) => {
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:3000/signup", data);
      if (res.status === 200) {
        localStorage.setItem("Verify-email", data.email);
        toast.success("Otp sent on your email");
        navigate("/verify");
      }
    } catch (error: any) {
      if (error.status === 400) {
        toast.error("User already exists");
      } else if (error.status === 403) {
        toast.info("Email not verified otp sent again");
        localStorage.setItem("Verify-email", data.email);
        navigate("/verify");
      } else if (error.status === 500) {
        toast.error(error.message);
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <main className="flex justify-center items-center h-[90vh]">
        <form
          onSubmit={handleSubmit(onsubmit)}
          className="flex flex-col gap-6 bg-white p-8 rounded-xl shadow-lg w-[300px]"
        >
          <p className="text-2xl font-bold mb-2 -my-2">Sign-up</p>
          <div className="flex justify-center items-center gap-4  py-1 px-1 border rounded">
            <User2Icon className="text-gray-500" />
            <input
              className="p-3 outline-none w-full"
              type="text"
              placeholder="Enter username"
              {...register("username")}
            />
          </div>
          {errors.username && (
            <p className="text-red-600 text-sm">{errors.username.message}</p>
          )}
          <div className="flex justify-center items-center gap-4  py-1 px-1 border rounded">
            <MailIcon className="text-gray-500" />
            <input
              className="p-3 outline-none w-full"
              type="email"
              placeholder="Enter email"
              {...register("email")}
            />
          </div>
          {errors.email && (
            <p className="text-red-600 text-sm">{errors.email.message}</p>
          )}
          <div className="flex justify-center items-center gap-4 py-1 px-1 border rounded">
            <Lock className="text-gray-500" />
            <input
              className="p-3 outline-none w-full"
              type="password"
              placeholder="Enter password"
              {...register("password")}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="bg-blue-300 rounded-xl text-md flex flex-col text-red-600 px-3 py-3 gap-2 font-bold max-h-[150px] overflow-y-auto">
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
          <Button
            className="w-full flex justify-center items-center gap-2 border hover:bg-accent"
            type="submit"
            variant={"outline"}
          >
            {Loading ? <Loader2 className="animate-spin" /> : <Check />}
            Submit
          </Button>
        </form>
      </main>
    </>
  );
};

export default Signup;
