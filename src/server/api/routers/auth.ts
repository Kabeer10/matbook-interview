import bcrypt from "bcrypt";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { db } from "~/server/db";
import { users } from "~/server/db/schema";
import { registerSchema } from "~/server/validators/auth";

export const authRouter = createTRPCRouter({
  registerUser: publicProcedure
    .input(registerSchema)
    .mutation(async ({ input }) => {
      const isExists = await db.query.users.findFirst({
        where: (users, { eq }) => eq(users.email, input.email),
      });

      if (isExists) {
        throw new Error("User already exists");
      }

      await db.insert(users).values({
        name: input.name,
        email: input.email,
        hash: await bcrypt.hash(input.password, 10),
        emailVerified: new Date(),
      });

      return {
        success: true,
      };
    }),
});
