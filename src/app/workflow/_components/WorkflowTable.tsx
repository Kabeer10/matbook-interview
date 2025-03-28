"use client";
import React, { useState } from "react";
import {
  MoreHorizontal,
  ArrowDown,
  ArrowUp,
  Loader2,
  ExternalLink,
} from "lucide-react";
import { Button, buttonVariants } from "~/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { api } from "~/trpc/react";
import { toast } from "sonner";
import Link from "next/link";
import { cn } from "~/lib/utils";
import Paginate from "./Paginate";
import { useRouter } from "next/navigation";
import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineSeparator,
  TimelineTitle,
} from "~/components/ui/timeline";
import MoreOptions from "./MoreOptions";

const formatDate = (dateString: string | Date) => {
  const date = new Date(dateString);

  const time = new Intl.DateTimeFormat("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");

  return `${time} IST - ${day}/${month}`;
};

const EXAMPLE_TIMELINE = [
  {
    createdAt: new Date(),
    status: "Passed",
  },
  {
    createdAt: new Date(),
    status: "Passed",
  },
  {
    createdAt: new Date(),
    status: "Passed",
  },
  {
    createdAt: new Date(),
    status: "Passed",
  },
  {
    createdAt: new Date(),
    status: "Failed",
  },
];

const LIMIT = 10;
const WorkflowTable = ({ page, search }: { page: number; search?: string }) => {
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});
  const utils = api.useUtils();

  const router = useRouter();

  const { data, isPending, isError } = api.workflow.getWorkFlows.useQuery({
    limit: LIMIT,
    page,
    search,
  });

  const workflowMutation = api.workflow.updateWorkflow.useMutation({
    onMutate: () => {
      toast.loading("Updating...", {
        id: "update",
      });
    },
    onSuccess: async () => {
      await utils.workflow.getWorkFlows.invalidate();
      toast.success("Updated Successfully", {
        id: "update",
      });
    },
  });

  const toggleRowExpansion = (id: string) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  if (isPending)
    return (
      <div className="bg-card text-card-foreground grid min-h-[400px] flex-col place-items-center rounded-lg px-4 py-6">
        <Loader2 className="animate-spin" size={40} />
      </div>
    );
  if (isError) return <div>Error</div>;

  const { total, workflows } = data;

  const handlePageChange = (page: number) => {
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set("page", String(page));
    router.push(`${window.location.pathname}?${searchParams.toString()}`);
  };

  return (
    <div className="bg-card text-card-foreground flex min-h-[400px] flex-col rounded-lg px-4 py-6">
      <Table>
        <TableHeader>
          <TableRow className="border-primary">
            <TableHead>Workflow Name</TableHead>
            <TableHead>ID</TableHead>
            <TableHead>Last Edited On</TableHead>
            <TableHead className="flex-grow">Description</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {workflows.map((workflow) => (
            <React.Fragment key={workflow.id}>
              <TableRow className="h-20 text-[#4F4F4F]">
                <TableCell className="max-w-[200px] truncate overflow-hidden whitespace-nowrap">
                  {workflow.name}
                </TableCell>
                <TableCell>#{workflow.id}</TableCell>
                <TableCell>
                  {workflow.user.name} | {formatDate(workflow.updatedAt!)}
                </TableCell>
                <TableCell className="max-w-[300px] truncate overflow-hidden whitespace-nowrap">
                  {workflow.description}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="border-0 shadow-none"
                      onClick={() =>
                        workflowMutation.mutate({
                          id: workflow.id,
                          isPinned: !workflow.isPinned,
                        })
                      }
                    >
                      <img
                        src={
                          workflow.isPinned
                            ? "/icons/pinned.png"
                            : "/icons/unpinned.png"
                        }
                        alt="pin"
                      />
                    </Button>
                    <Button
                      variant="outline"
                      className="text-xs font-medium text-[#221F20]"
                      onClick={() => toast.warning("Under Development")}
                    >
                      Execute
                    </Button>
                    <Link
                      href={`/workflow/edit/${workflow.id}`}
                      className={cn(
                        buttonVariants({ variant: "outline" }),
                        "text-xs font-medium text-[#221F20]",
                      )}
                    >
                      Edit
                    </Link>
                    <MoreOptions
                      id={workflow.id.toString()}
                      name={workflow.name}
                    />

                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-card-foreground"
                      onClick={() => toggleRowExpansion(workflow.id.toString())}
                    >
                      {!expandedRows[workflow.id] ? <ArrowDown /> : <ArrowUp />}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
              {expandedRows[workflow.id] && (
                <TableRow>
                  <TableCell colSpan={6} className="p-0">
                    <div className="bg-[#FFFAF2] p-4">
                      <Timeline>
                        {EXAMPLE_TIMELINE.map((item, index) => (
                          <TimelineItem key={index}>
                            <TimelineSeparator>
                              <TimelineDot className="text-primary" />
                              {index === EXAMPLE_TIMELINE.length - 1 ? null : (
                                <TimelineConnector className="bg-primary/20 my-0 h-6 w-1" />
                              )}
                            </TimelineSeparator>
                            <TimelineContent>
                              <TimelineTitle className="flex items-center gap-x-4">
                                <span className="text-sm">
                                  {formatDate(item.createdAt)}
                                </span>

                                <span
                                  className={cn(
                                    "rounded-lg px-2 py-1 text-xs text-[#221F20]",
                                    item.status === "Passed" && "bg-[#DDEBC0]",
                                    item.status === "Failed" && "bg-[#F8AEA8]",
                                  )}
                                >
                                  {item.status}
                                </span>
                                <button
                                  onClick={() =>
                                    toast.warning("Under Development")
                                  }
                                >
                                  <ExternalLink size={16} />
                                </button>
                              </TimelineTitle>
                            </TimelineContent>
                          </TimelineItem>
                        ))}
                      </Timeline>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>

      <div className="mt-auto flex justify-end">
        <Paginate
          totalPages={
            Math.ceil(total / LIMIT) === 0 ? 1 : Math.ceil(total / LIMIT)
          }
          activePage={page}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default WorkflowTable;
