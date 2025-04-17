import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import bcrypt from "bcrypt";
import User from "./Models/user";
import Otp from "./Models/otp";
import mongoose from "mongoose";
import { SendMail } from "./utils/SendMailTransporter";
dotenv.config();
const app: Express = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI as string);

app.post("/signup", async (req: Request, res: Response): Promise<any> => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      if (!existingUser.isVerified) {
        await Otp.deleteMany({ email });

        const otp = Math.floor(100000 + Math.random() * 900000);

        await Otp.create({
          otp,
          email,
          expiresAt: new Date(Date.now() + 10 * 60 * 1000),
        });

        await SendMail(email, otp.toString());

        return res
          .status(403)
          .json({ message: "User exists but not verified. OTP re-sent." });
      }

      return res.status(400).json({ message: "User already exists" });
    }

    if (!existingUser) {
      const hashPass = await bcrypt.hash(password, 10);

      const newUser = new User({
        username,
        email,
        password: hashPass,
      });
      await newUser.save();
    }
    const otp = Math.floor(100000 + Math.random() * 900000);

    await Otp.findOneAndDelete({ email });
    await Otp.create({
      otp,
      email,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    });
    await SendMail(email, otp.toString());

    return res.status(200).json({ message: "OTP sent to email" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/verify", async (req: Request, res: Response): Promise<any> => {
  try {
    const { otp, email } = req.body;

    const existing = await Otp.findOne({ email, otp });

    if (!existing || existing.expiresAt < new Date()) {
      return res.status(400).json({ message: "Invalid or expired otp" });
    }

    await User.updateOne({ email }, { $set: { isVerified: true } });
    await Otp.deleteOne({ email });

    return res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error" });
  }
});

app.post("/resend-otp", async (req: Request, res: Response): Promise<any> => {
  try {
    const { email } = req.body;

    await Otp.deleteMany({ email });
    const otp = Math.floor(100000 + Math.random() * 900000);

    await Otp.create({
      email,
      otp,
      expiresAt: Date.now() + 10 * 60 * 1000,
    });

    await SendMail(email, otp.toString());

    return res.status(200).json({ message: "Otp sent" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error" });
  }
});

app.post("/login", async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (!user.isVerified) {
      return res.status(403).json({ message: "User is not verified" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    await User.findOneAndUpdate({ email }, { $set: { isLoggedIn: true } });
    return res.status(200).json({ message: "Login successfull" });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
});

app.post("/welcome", async (req: Request, res: Response): Promise<any> => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user?.isLoggedIn) {
      return res.status(400).json({ message: "User not logged in" });
    }

    return res.status(200).json({ username: user.username });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
});

app.post("/logout", async (req: Request, res: Response): Promise<any> => {
  try {
    const { email } = req.body;

    console.log(email);

    const user = await User.findOneAndUpdate(
      { email },
      { $set: { isLoggedIn: false } }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ message: "Logged out" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/forgot", async (req: Request, res: Response): Promise<any> => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await Otp.deleteMany({ email });
    await Otp.create({ otp, email, expiresAt });

    await SendMail(email, otp.toString());

    return res.status(200).json({ message: "Otp sent" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error" });
  }
});

app.post("/reset-verify", async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, otp } = req.body;

    const isValid = await Otp.findOne({ email, otp });
    if (!isValid || isValid.expiresAt < new Date()) {
      return res.status(400).json({ message: "Invalid ot expired otp" });
    }

    await Otp.deleteMany({ email });
    return res.status(200).json({ message: "Email verified" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error" });
  }
});

app.post(
  "/reset-password",
  async (req: Request, res: Response): Promise<any> => {
    try {
      const { email, password } = req.body;

      const hashPass = await bcrypt.hash(password, 10);

      const user = await User.findOneAndUpdate(
        { email },
        { $set: { password: hashPass } }
      );

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.status(200).json({ message: "Password reset" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Server error" });
    }
  }
);

app.post("/edit-profile", async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, upd_username } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await User.findOneAndUpdate(
      { email },
      { $set: { username: upd_username } }
    );
    return res.status(200).json({ message: "Updated" });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
});

app.post(
  "/delete-profile",
  async (req: Request, res: Response): Promise<any> => {
    try {
      const { email } = req.body;

      const user = await User.findOneAndDelete({ email });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.status(200).json({ message: "Profile deleted" });
    } catch (error) {
      return res.status(500).json({ message: "Server error" });
    }
  }
);

app.listen(port, () => {
  console.log(`App is running on ${port}`);
});
