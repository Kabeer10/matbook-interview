import WorkFlow from "~/components/workflow-editor/WorkFlow";
import { api } from "~/trpc/server";

type Params = Promise<{ workflowId: string }>;
export default async function EditWorkFlow({ params }: { params: Params }) {
  const { workflowId } = await params;
  const workflowData = await api.workflow.getWorkFlow({
    id: Number(workflowId),
  });

  if (!workflowData?.workflow) {
    return <div>Workflow not found</div>;
  }

  return (
    <>
      <WorkFlow workflow={workflowData.workflow} />
    </>
  );
}
