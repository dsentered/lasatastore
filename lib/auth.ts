import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
// If your Prisma file is located elsewhere, you can change the path
import { PrismaClient } from "@/generated/prisma/client";
import { nextCookies } from "better-auth/next-js";
import { Resend } from "resend";
import ForgotPasswordEmail from "@/components/emails/reset-password";

const resend = new Resend(process.env.RESEND_API_KEY);


const prisma = new PrismaClient();
export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "mongodb", // or "mysql", "postgresql", ...etc
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    minPasswordLength: 8,
    maxPasswordLength: 20,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      await resend.emails.send({
        from: "Lasata Store <info@jyasha.com>", // You could add your custom domain
        to: user.email, // email of the user to want to end
        subject: "Reset your password", // Main subject of the email
        react: ForgotPasswordEmail({ username: user.name, userEmail: user.email, resetLink: url })
      });
    },
    onPasswordReset: async ({ user }) => {
      console.log(`Password for user ${user.email} has been reset.`);
    },
  },
  emailVerification: {
    sendOnSignUp: true, // Automatically sends a verification email at signup
    autoSignInAfterVerification: true, // Automatically signIn the user after verification
    sendVerificationEmail: async ({ user, url }) => {
      await resend.emails.send({
        from: "Lasata Store <info@jyasha.com>", // You could add your custom domain
        to: user.email, // email of the user to want to end
        subject: "Email Verification", // Main subject of the email
        react: ForgotPasswordEmail({ username: user.name, userEmail: user.email, resetLink: url })
      });
    },
  },
  account: {
    accountLinking: {
      enabled: true,
    },
    storeAccountCookie: true,
  },
  socialProviders: {
    google: {
      prompt: "select_account", // This will prompt the user to select an account
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      mapProfileToUser: (profile) => ({
        firstName: profile.given_name,
        lastName: profile.family_name,
      }),
    },
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true,
        defaultValue: "USER",
        input: false
      },
      firstName: {
        type: "string",
        required: true,
      },
      lastName: {
        type: "string",
        required: true,
      },
    },
  },
  plugins: [
    nextCookies(),
  ]
});