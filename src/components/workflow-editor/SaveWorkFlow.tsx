import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import { api } from "~/trpc/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useWorkflow } from "./WorkflowProvider";
import Link from "next/link";

export default function SaveWorkFlow() {
  const { workflow } = useWorkflow();
  return (
    <div className="bg-card text-card-foreground border-border absolute top-5 left-5 z-40 flex h-[46px] items-center gap-x-4 rounded-lg border px-4 shadow-md">
      <Link href="/workflow" className="font-semibold underline">
        {"<-"} Go Back
      </Link>
      <h6 className="font-semibold">{workflow?.name ?? "Untitled"}</h6>
      <SaveModal />
    </div>
  );
}

const saveSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(1000),
});

type SaveSchema = z.infer<typeof saveSchema>;

function SaveModal() {
  const { workflow, edges, nodes } = useWorkflow();

  const router = useRouter();
  const form = useForm<SaveSchema>({
    defaultValues: {
      name: workflow?.name ?? "",
      description: workflow?.description ?? "",
    },
    resolver: zodResolver(saveSchema),
  });

  const createMutation = api.workflow.createWorkflow.useMutation({
    onMutate: () => {
      toast.loading("Saving...", {
        id: "save",
      });
    },
    onSuccess: (data) => {
      toast.success("Saved successfully", {
        id: "save",
      });
      router.push(`/workflow/edit/${data.workflow?.id}`);
    },
    onError: (e) => {
      toast.error(e.message, {
        id: "save",
      });
    },
  });

  const updateMutation = api.workflow.updateWorkflow.useMutation({
    onMutate: () => {
      toast.loading("Saving...", {
        id: "save",
      });
    },
    onSuccess: () => {
      toast.success("Saved successfully", {
        id: "save",
      });

      router.refresh();
    },
    onError: (e) => {
      toast.error(e.message, {
        id: "save",
      });
    },
  });

  const handleSave = (data: SaveSchema) => {
    if (workflow) {
      updateMutation.mutate({
        id: Number(workflow.id),
        name: data.name,
        description: data.description,
        edges,
        nodes,
      });
    } else {
      createMutation.mutate({
        name: data.name,
        description: data.description,
        edges,
        nodes,
      });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button>
          <img src="/icons/save.png" alt="save" />
        </button>
      </DialogTrigger>
      <DialogContent className="bg-card text-card-foreground">
        <DialogHeader>
          <DialogTitle className="text-left text-lg font-semibold text-[#333333]">
            Save your workflow
          </DialogTitle>
        </DialogHeader>
        <form
          className="flex flex-col space-y-4"
          onSubmit={form.handleSubmit(handleSave)}
        >
          <Input
            {...form.register("name")}
            placeholder="Name here"
            label="Name"
            error={form.formState.errors.name?.message}
          />
          <div>
            <Label>Description</Label>
            <Textarea
              rows={5}
              placeholder="Write here..."
              {...form.register("description")}
            />
            {form.formState.errors.description?.message && (
              <p className="text-destructive mt-1 text-xs font-semibold">
                {form.formState.errors.description.message}
              </p>
            )}
          </div>

          <Separator className="!mt-8" />
          <div className="flex justify-end">
            <Button
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              Save
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
