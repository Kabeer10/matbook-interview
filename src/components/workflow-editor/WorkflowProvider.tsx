"use client";
import React, { createContext, useContext, useCallback } from "react";
import {
  type Node,
  type Edge,
  addEdge,
  useNodesState,
  useEdgesState,
  type OnConnect,
  type OnEdgesChange,
  type OnNodesChange,
  MarkerType,
} from "@xyflow/react";

// Define types
interface WorkflowContextType {
  nodes: Node[];
  edges: Edge[];
  workflow?: Workflow;
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
  onNodesChange: OnNodesChange<Node>;
  onEdgesChange: OnEdgesChange<Edge>;
  onConnect: OnConnect;
}

// Create Context
const WorkflowContext = createContext<WorkflowContextType | undefined>(
  undefined,
);

export type Workflow = {
  nodes: Node[];
  edges: Edge[];
  id: number;
  name: string;
  createdById: string;
  createdAt: Date;
  updatedAt: Date | null;
  description: string | null;
  isPinned: boolean;
};

// Provider Component
export const WorkflowProvider: React.FC<{
  children: React.ReactNode;
  workflow?: Workflow;
}> = ({ children, workflow }) => {
  const initialNodes: Node[] = [
    { id: "start", type: "startNode", position: { x: 0, y: 0 }, data: {} },
    { id: "end", type: "endNode", position: { x: 0, y: 200 }, data: {} },
  ];

  const initialEdges: Edge[] = [
    {
      id: "initial-edge",
      source: "start",
      target: "end",
      type: "buttonedge",
      markerEnd: {
        type: MarkerType.Arrow,
        width: 20,
        height: 20,
        color: "#4F4F4F",
      },
      style: { strokeWidth: 2, stroke: "#4F4F4F" },
    },
  ];

  const [nodes, , onNodesChange] = useNodesState(
    workflow?.nodes ?? initialNodes,
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState(
    workflow?.edges ?? initialEdges,
  );

  const onConnect: OnConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [],
  );

  return (
    <WorkflowContext.Provider
      value={{
        nodes,
        edges,
        workflow,
        setEdges,
        onNodesChange,
        onEdgesChange,
        onConnect,
      }}
    >
      {children}
    </WorkflowContext.Provider>
  );
};

// Custom Hook to use Workflow Context
export const useWorkflow = () => {
  const context = useContext(WorkflowContext);
  if (!context) {
    throw new Error("useWorkflow must be used within a WorkflowProvider");
  }
  return context;
};
