"use client";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterSchema } from "~/server/validators/auth";
import { api } from "~/trpc/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function RegisterForm() {
  const form = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
  });

  const router = useRouter();

  const registerMutation = api.auth.registerUser.useMutation({
    onMutate: () => {
      toast.loading("Registering...", {
        id: "register",
      });
    },
    onSuccess: () => {
      toast.success("Registered successfully. Please Login", {
        id: "register",
      });

      setTimeout(() => {
        router.push("/login");
      }, 2000);
    },
    onError: (e) => {
      toast.error(e.message, {
        id: "register",
      });
    },
  });

  return (
    <form
      className="mt-6 space-y-4"
      onSubmit={form.handleSubmit((data) => registerMutation.mutate(data))}
    >
      <Input
        id="name"
        placeholder="Type here..."
        className="mt-1.5"
        label="Full Name"
        {...form.register("name")}
        error={form.formState.errors.name?.message}
      />
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

      <Button
        size="lg"
        type="submit"
        className="w-full text-sm font-bold"
        disabled={registerMutation.isPending}
      >
        Register
      </Button>
    </form>
  );
}
