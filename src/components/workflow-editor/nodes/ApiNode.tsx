import React, { memo } from "react";
import {
  Handle,
  Position,
  useReactFlow,
  type Edge,
  type NodeProps,
} from "@xyflow/react";
import { Trash2 } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { Button } from "~/components/ui/button";

export default memo(function ApiNode({ id, data }: NodeProps) {
  const [open, setOpen] = React.useState(false);
  const { setNodes, setEdges } = useReactFlow();

  const handleDeleteNode = () => {
    setNodes((nds) => nds.filter((node) => node.id !== id));

    setEdges((eds) => {
      // Determine the edges connected to the node being deleted
      const incomingEdges = eds.filter((edge) => edge.target === id);
      const outgoingEdges = eds.filter((edge) => edge.source === id);

      // Remove all edges connected to this node
      const remainingEdges = eds.filter(
        (edge) => edge.source !== id && edge.target !== id,
      );

      //if exactly one incoming and one outgoing edge exist, reconnect them.
      if (incomingEdges.length === 1 && outgoingEdges.length === 1) {
        const newEdge = {
          id: `edge-${incomingEdges[0]?.source}-${outgoingEdges[0]?.target}`,
          source: incomingEdges[0]?.source,
          target: outgoingEdges[0]?.target,
          type: incomingEdges[0]?.type ?? "buttonEdge",
          markerEnd: incomingEdges[0]?.markerEnd,
          style: incomingEdges[0]?.style,
        } as Edge;

        return [...remainingEdges, newEdge];
      }
      return remainingEdges;
    });
  };

  return (
    <>
      <Handle
        type="target"
        position={Position.Top}
        onConnect={(params) => console.log("handle onConnect", params)}
        isConnectable={true}
        className="invisible"
      />
      <div className="bg-card smooth text-card-foreground flex h-16 w-[300px] items-center justify-between rounded-lg border border-[#849E4C] px-6 hover:bg-[#F7FAEF]">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <button className="h-full w-full text-left text-xs font-medium text-[#4F4F4F]">
              API Call
            </button>
          </PopoverTrigger>
          <PopoverContent
            side="right"
            className="ml-6 flex w-fit items-start border-0 bg-transparent shadow-none"
          >
            <button
              className="bg-card group text-destructive block rounded-lg p-1 py-2 text-sm font-semibold"
              style={{
                writingMode: "sideways-lr",
              }}
            >
              <span className="group-hover:bg-destructive/20 smooth rounded-md p-1 px-2">
                Configuration
              </span>
            </button>

            <div className="bg-card text-card-foreground ml-4 w-full max-w-sm rounded-md p-6">
              <ApiForm
                nodeId={id}
                data={data as ApiFormValues}
                setOpen={setOpen}
              />
            </div>
          </PopoverContent>
        </Popover>

        <button onClick={handleDeleteNode} className="p-2">
          <Trash2 className="text-destructive" size={12} />
        </button>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        onConnect={(params) => console.log("handle onConnect", params)}
        isConnectable={true}
        className="invisible"
      />
    </>
  );
});

const METHODS = ["GET", "POST", "PUT", "DELETE"] as const;
const apiFormSchema = z.object({
  method: z.enum(METHODS, {
    errorMap: () => ({
      message: "Please select a method",
    }),
  }),
  url: z.string().url("Invalid URL"),
  headers: z.string(),
  body: z.string(),
});

type ApiFormValues = z.infer<typeof apiFormSchema>;

function ApiForm({
  nodeId,
  data,
  setOpen,
}: {
  nodeId: string;
  data?: ApiFormValues;
  setOpen: (open: boolean) => void;
}) {
  const form = useForm<ApiFormValues>({
    defaultValues: data,
    resolver: zodResolver(apiFormSchema),
  });

  const { setNodes } = useReactFlow();

  const onSubmit = (data: ApiFormValues) => {
    setNodes((nds) => {
      const updatedNodes = nds.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            data,
          };
        }
        return node;
      });
      return updatedNodes;
    });
    setOpen(false);
  };

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <div>
        <Label>Method</Label>
        <Select
          value={form.watch("method")}
          onValueChange={(method) =>
            form.setValue("method", method as (typeof METHODS)[number])
          }
        >
          <SelectTrigger className="mt-1.5 w-full">
            <SelectValue placeholder="Select Method" />
          </SelectTrigger>
          <SelectContent>
            {METHODS.map((method) => (
              <SelectItem key={method} value={method}>
                {method}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {form.formState.errors.method?.message && (
          <p className="text-destructive mt-1 text-xs font-semibold">
            {form.formState.errors.method.message}
          </p>
        )}
      </div>
      <Input
        label="URL"
        placeholder="Type here..."
        {...form.register("url")}
        error={form.formState.errors.url?.message}
      />

      <Input
        label="Headers"
        placeholder="Header Name"
        {...form.register("headers")}
        error={form.formState.errors.headers?.message}
      />

      <div>
        <Label>Body</Label>
        <Textarea
          rows={5}
          placeholder="Enter Descriptions..."
          {...form.register("body")}
        />
        {form.formState.errors.body?.message && (
          <p className="text-destructive mt-1 text-xs font-semibold">
            {form.formState.errors.body.message}
          </p>
        )}
      </div>
      <Button>Save</Button>
    </form>
  );
}
