// // All database interaction will happen in this file

// import "server-only";

// import { cache } from "react";
// import { getAuthenticateUser } from "./session";
// import { User } from "@/lib/db/models/userModel";
// import { UserType } from "./definitions";
// import { cookies } from "next/headers";

// export const getUser = cache(async (): Promise<UserType | null> => {
//   const cookieStore = await cookies();
//   const session = await getAuthenticateUser();
//   if (!session) return null;

//   try {

//     const user = await User.findById(session.userId)
//       .select("name age email phone gender")
//       .lean<UserType>()
//       .exec();
//     return user;
//   } catch (error) {
//     console.log(error);
//     return null;
//   }
// });
