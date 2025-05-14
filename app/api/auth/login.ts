import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs"
import { User } from "@/db/models/userModel";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user) {
      const isPasswordCorrect = await bcrypt.compare(password, user.password);
      if (isPasswordCorrect) {
        if (user.is_verified) {
          req.session.user_id = user._id;
          return res.redirect("/home");
        } else {
          return res.status(401).json({error: "Invalid credentials."})
        }
      } else {
        return res.status(401).json({error: "Invalid credentials."})
      }
    } else {
      return res.status(404).json({error: "User does not exist."})
    }

  } catch (error: any) {
    if (error.type === "CredentialsSignin") {
      res.status(401).json({ error: "Invalid credentials." });
    } else {
      res.status(500).json({ error: "Something went wrong." });
    }
  }
}
