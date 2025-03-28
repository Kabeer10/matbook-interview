import { Button } from "~/components/ui/button";
import { Undo2, Redo2 } from "lucide-react";
import { useWorkflow } from "./WorkflowProvider";

export default function UndoRedoControls() {
  const { undo, redo } = useWorkflow();

  return (
    <div className="bg-card text-card-foreground border-border absolute bottom-20 left-8 z-40 flex h-10 items-center rounded-lg border-2 shadow-md md:bottom-5 md:left-5">
      <button onClick={undo} className="border-border h-8 border-r px-3">
        <Undo2 size={16} />
      </button>
      <button onClick={redo} className="border-border h-8 border-l px-3">
        <Redo2 size={16} />
      </button>
    </div>
  );
}
