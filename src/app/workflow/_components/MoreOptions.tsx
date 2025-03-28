import { PopoverArrow } from "@radix-ui/react-popover";
import { MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "~/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { Separator } from "~/components/ui/separator";
import { api } from "~/trpc/react";

interface MoreOptionsProps {
  id: string;
  name: string;
}
export default function MoreOptions({ id, name }: MoreOptionsProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="text-[#221F20]">
          <MoreHorizontal className="rotate-90" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-fit border-0 p-0">
        <DeleteWorkflow id={id} name={name} />
        <PopoverArrow className="fill-popover" />
      </PopoverContent>
    </Popover>
  );
}

function DeleteWorkflow({ id, name }: MoreOptionsProps) {
  const [open, setOpen] = useState(false);

  const utils = api.useUtils();

  const deleteMutation = api.workflow.deleteWorkflow.useMutation({
    onMutate: () => {
      toast.loading("Deleting...", {
        id: "delete",
      });
    },
    onSuccess: async () => {
      await utils.workflow.getWorkFlows.invalidate();
      toast.success("Deleted Successfully", {
        id: "delete",
      });
    },
    onError: (e) => {
      toast.error(e.message, {
        id: "delete",
      });
    },
  });
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="link" className="text-destructive">
          Delete
        </Button>
      </DialogTrigger>
      <DialogContent className="flex flex-col p-0 pb-4">
        <section className="grid h-[150px] place-items-center">
          <div>
            <h6 className="text-center text-sm font-semibold">{`"Are you sure you want to Delete '${name}'?`}</h6>
            <p className="text-destructive mt-2 text-center text-xs font-medium">
              You cannot Undo this step
            </p>
          </div>
        </section>
        <Separator className="mb-2" />
        <section className="flex justify-end gap-x-2 px-4">
          <Button
            variant="outline"
            className="text-xs font-medium"
            disabled={deleteMutation.isPending}
            onClick={() => deleteMutation.mutate({ id: Number(id) })}
          >
            Yes
          </Button>
          <Button
            variant="outline"
            className="text-xs font-medium"
            onClick={() => setOpen(false)}
          >
            No
          </Button>
        </section>
      </DialogContent>
    </Dialog>
  );
}
