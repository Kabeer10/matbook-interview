import WorkflowEditor from "./WorkflowEditor";
import { WorkflowProvider, type Workflow } from "./WorkflowProvider";

export default function WorkFlow({ workflow }: { workflow?: Workflow }) {
  return (
    <WorkflowProvider workflow={workflow}>
      <WorkflowEditor />
    </WorkflowProvider>
  );
}
