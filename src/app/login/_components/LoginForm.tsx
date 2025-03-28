"use client";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { z } from "zod";
import { Checkbox } from "~/components/ui/checkbox";
import { Label } from "~/components/ui/label";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginSchema = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const form = useForm<LoginSchema>({
    defaultValues: {
      email: "test@gmail.com",
      password: "12345678",
    },
    resolver: zodResolver(loginSchema),
  });

  const router = useRouter();

  const handleLogin = async (data: LoginSchema) => {
    toast.loading("Signing in...", {
      id: "login",
    });
    const res = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    if (res?.error) {
      toast.error("Invalid email or password", {
        id: "login",
      });
      return;
    }

    toast.success("Welcome Back!", {
      id: "login",
    });

    router.refresh();
  };

  return (
    <form
      className="mt-6 space-y-4"
      onSubmit={form.handleSubmit((data) => handleLogin(data))}
    >
      <Input
        id="email"
        placeholder="Type here..."
        className="mt-1.5"
        label="Email"
        {...form.register("email")}
        error={form.formState.errors.email?.message}
      />

      <Input
        id="password"
        type="password"
        placeholder="Type here..."
        className="mt-1.5"
        label="Password"
        {...form.register("password")}
        error={form.formState.errors.password?.message}
      />

      <div className="mt-5 flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <Checkbox id="remember" />
          <Label htmlFor="remember" className="text-[12.8px] text-black">
            Remember me
          </Label>
        </div>
        <a
          href="#"
          className="text-[12.8px] font-medium text-[#424242] hover:underline"
        >
          Forgot Password?
        </a>
      </div>
      <Button size="lg" type="submit" className="w-full text-sm font-bold">
        Log In
      </Button>
    </form>
  );
}
