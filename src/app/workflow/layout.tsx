import { redirect } from "next/navigation";
import { auth } from "~/server/auth";

export default async function WorkflowLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }
  return children;
}
