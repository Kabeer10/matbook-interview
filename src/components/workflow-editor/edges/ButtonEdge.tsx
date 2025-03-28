import {
  BaseEdge,
  EdgeLabelRenderer,
  useReactFlow,
  type EdgeProps,
  type Node,
  getStraightPath,
} from "@xyflow/react";
import { Plus } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";
import { Button } from "../../ui/button";
import { PopoverArrow } from "@radix-ui/react-popover";

type NodeType = "apiNode" | "emailNode" | "textNode";

export default function ButtonEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  style = {},
  markerEnd,
}: EdgeProps) {
  const { setEdges, setNodes } = useReactFlow();
  const [edgePath, labelX, labelY] = getStraightPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  const addNode = (nodeType: NodeType) => {
    const newNodeId = `${nodeType}-${Date.now()}`;
    const newNodeHeight = 50; // Estimated height of the new API node
    const extraSpace = newNodeHeight + 70; // Extra spacing for clarity
    const nodeWidth = 150;

    // Move nodes down and add the new API node
    setNodes((nds) => {
      // Shift nodes below the target down by extraSpace
      const updatedNodes = nds.map((node) =>
        node.position.y > targetY
          ? {
              ...node,
              position: { ...node.position, y: node.position.y + extraSpace },
            }
          : node,
      );

      // Insert the new API node at the midpoint between source and target
      const newApiNode = {
        id: newNodeId,
        type: nodeType,
        position: {
          x: (sourceX + targetX) / 2 - nodeWidth,
          y: (sourceY + targetY + newNodeHeight) / 2,
        },
        data: {},
      } satisfies Node;

      return [...updatedNodes, newApiNode];
    });

    // Update edges: remove the current edge and add two new ones
    setEdges((eds) => {
      const currentEdge = eds.find((edge) => edge.id === id);
      if (!currentEdge) return eds;
      const { source, target } = currentEdge;

      return [
        ...eds.filter((edge) => edge.id !== id),
        {
          id: `edge-${source}-${newNodeId}`,
          source,
          target: newNodeId,
          type: "buttonedge",
          markerEnd: currentEdge.markerEnd,
          style: currentEdge.style,
        },
        {
          id: `edge-${newNodeId}-${target}`,
          source: newNodeId,
          target,
          type: "buttonedge",
          markerEnd: currentEdge.markerEnd,
          style: currentEdge.style,
        },
      ];
    });
  };

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />
      <EdgeLabelRenderer>
        <div
          className="nodrag nopan pointer-events-auto absolute origin-center"
          style={{
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
          }}
        >
          <Popover>
            <PopoverTrigger asChild>
              <button className="smooth flex size-6 items-center justify-center rounded-full border border-[#4F4F4F] bg-white text-[#4F4F4F] hover:border-[#EE3425] hover:bg-[#fdebe9] hover:text-[#EE3425]">
                <Plus size={12} />
              </button>
            </PopoverTrigger>
            <PopoverContent
              side="right"
              className="bg-card text-card-foreground flex max-w-[200px] flex-wrap items-center gap-4"
            >
              <Button
                variant="outline"
                className="h-[34px] px-3 text-xs font-medium"
                onClick={() => addNode("apiNode")}
              >
                API Call
              </Button>
              <Button
                variant="outline"
                className="h-[34px] px-3 text-xs font-medium"
                onClick={() => addNode("emailNode")}
              >
                Email
              </Button>

              <Button
                variant="outline"
                className="h-[34px] px-3 text-xs font-medium"
                onClick={() => addNode("textNode")}
              >
                Text Box
              </Button>
              <PopoverArrow className="fill-card" />
            </PopoverContent>
          </Popover>
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
