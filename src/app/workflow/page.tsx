import { Menu } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { cn } from "~/lib/utils";
import WorkflowTable from "./_components/WorkflowTable";
import SearchWorkflow from "./_components/Search";

type SearchParams = Promise<{
  search?: string;
  page?: string;
}>;

export default async function WorkflowPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const searchData = await searchParams;
  const search = searchData.search ?? "";
  const page = searchData.page ? Number(searchData.page) : 1;
  return (
    <section className="p-4 md:p-6">
      <nav className="flex items-center">
        <button className="border-border text-border bg-card rounded-lg border p-2">
          <Menu size={24} />
        </button>
        <h1 className="ml-6 text-[22px] font-semibold text-[#221F20]">
          Workflow Builder
        </h1>
      </nav>
      <section className="mx-auto mt-6 flex max-w-7xl items-center justify-between max-md:flex-col">
        <SearchWorkflow search={search} />
        <Link
          href="/workflow/new"
          className={cn(
            buttonVariants({ variant: "outline" }),
            "bg-[#221F20] text-white hover:bg-[#221F20]/90 hover:text-white max-md:mt-4 max-md:w-full",
          )}
        >
          + Create New Process
        </Link>
      </section>
      <section className="mx-auto mt-6 max-w-7xl">
        <WorkflowTable page={page} search={search} />
      </section>
    </section>
  );
}
