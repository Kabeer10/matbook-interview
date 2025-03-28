"use client";
import "@xyflow/react/dist/style.css";
import { ReactFlow, Background, ConnectionMode } from "@xyflow/react";
import ButtonEdge from "./edges/ButtonEdge";
import StartNode from "./nodes/StartNode";
import EndNode from "./nodes/EndNode";
import ApiNode from "./nodes/ApiNode";
import EmailNode from "./nodes/EmailNode";
import CustomControls from "./CustomControls";
import SaveWorkFlow from "./SaveWorkFlow";
import { useWorkflow } from "./WorkflowProvider";
import TextNode from "./nodes/TextNode";
import UndoRedoControls from "./UndoRedoControls";

const edgeTypes = {
  buttonedge: ButtonEdge,
};

const nodeTypes = {
  startNode: StartNode,
  endNode: EndNode,
  apiNode: ApiNode,
  emailNode: EmailNode,
  textNode: TextNode,
};

export default function WorkflowEditor() {
  const { edges, nodes, onConnect, onEdgesChange, onNodesChange } =
    useWorkflow();

  return (
    <div className="flex h-screen bg-[#F8F2E7]">
      <ReactFlow
        defaultEdgeOptions={{ type: "straight" }}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        edgeTypes={edgeTypes}
        nodeTypes={nodeTypes}
        fitView
        connectionMode={ConnectionMode.Strict}
        proOptions={{
          hideAttribution: true,
        }}
      >
        <Background />
        <CustomControls />
        <SaveWorkFlow />
        <UndoRedoControls />
      </ReactFlow>
    </div>
  );
}
