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
import { Button } from "~/components/ui/button";

export default memo(function TextNode({ id, data }: NodeProps) {
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
              Text Box
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
              <TextForm
                nodeId={id}
                data={data as TextFormValues}
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

const textFormSchema = z.object({
  message: z.string(),
});

type TextFormValues = z.infer<typeof textFormSchema>;

function TextForm({
  nodeId,
  data,
  setOpen,
}: {
  nodeId: string;
  data?: TextFormValues;
  setOpen: (open: boolean) => void;
}) {
  const form = useForm<TextFormValues>({
    defaultValues: data,
    resolver: zodResolver(textFormSchema),
  });

  const { setNodes } = useReactFlow();

  const onSubmit = (data: TextFormValues) => {
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
      <Input
        label="Message"
        placeholder="Enter..."
        {...form.register("message")}
        error={form.formState.errors.message?.message}
      />

      <Button>Save</Button>
    </form>
  );
}
