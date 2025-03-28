"use client";
import React, { createContext, useContext, useCallback, useState } from "react";
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

interface FlowState {
  nodes: Node[];
  edges: Edge[];
}

// Define types
interface WorkflowContextType {
  nodes: Node[];
  edges: Edge[];
  workflow?: Workflow;
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
  onNodesChange: OnNodesChange<Node>;
  onEdgesChange: OnEdgesChange<Edge>;
  onConnect: OnConnect;
  undo: () => void;
  redo: () => void;
  saveState: () => void;
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

  const [nodes, setNodes, onNodesChange] = useNodesState(
    workflow?.nodes ?? initialNodes,
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState(
    workflow?.edges ?? initialEdges,
  );

  const [undoStack, setUndoStack] = useState<FlowState[]>([]);
  const [redoStack, setRedoStack] = useState<FlowState[]>([]);

  // Save current state before making changes
  const saveState = useCallback(() => {
    setUndoStack((prev) => [...prev, { nodes, edges }]);
    setRedoStack([]); // Clear redo stack when making a new change
  }, [nodes, edges]);

  // Undo action
  const undo = useCallback(() => {
    if (undoStack.length === 0) return;

    const lastState = undoStack[undoStack.length - 1];

    if (!lastState) return;

    // Move current state to redo stack
    setRedoStack((prev) => [...prev, { nodes, edges }]);

    // Restore previous state
    setNodes(lastState.nodes);
    setEdges(lastState.edges);

    // Remove it from undo stack
    setUndoStack((prev) => prev.slice(0, -1));
  }, [undoStack, nodes, edges]);

  // Redo action
  const redo = useCallback(() => {
    if (redoStack.length === 0) return;

    const lastState = redoStack[redoStack.length - 1];

    if (!lastState) return;

    // Move current state to undo stack
    setUndoStack((prev) => [...prev, { nodes, edges }]);

    // Restore redo state
    setNodes(lastState.nodes);
    setEdges(lastState.edges);

    // Remove it from redo stack
    setRedoStack((prev) => prev.slice(0, -1));
  }, [redoStack, nodes, edges]);

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
        undo,
        redo,
        saveState,
        setNodes,
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
