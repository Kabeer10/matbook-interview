"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Input } from "~/components/ui/input";

export default function SearchWorkflow({ search }: { search: string }) {
  const [searchInput, setSearchInput] = useState(search);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set("search", searchInput);
    searchParams.set("page", "1");

    router.push(`${window.location.pathname}?${searchParams.toString()}`);
  };
  return (
    <form onSubmit={handleSubmit} className="relative w-full md:max-w-[340px]">
      <Input
        type="search"
        placeholder="Search By Workflow Name/ID"
        className="h-8 text-xs"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
      />
      <Search
        className="absolute top-1/2 right-2 -translate-y-1/2 text-[#CACACA]"
        size={16}
      />
    </form>
  );
}
