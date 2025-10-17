import { UserType } from "@kinde-oss/kinde-typescript-sdk";

declare module "express-serve-static-core" {
   interface Request {
      profile?: UserType; // type returned by kindeClient.getUserProfile
   }
}