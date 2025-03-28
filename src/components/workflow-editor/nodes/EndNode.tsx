import React, { memo } from "react";
import { Handle, Position } from "@xyflow/react";

export default memo(function EndNode() {
  return (
    <>
      <Handle
        type="target"
        position={Position.Top}
        onConnect={(params) => console.log("handle onConnect", params)}
        isConnectable={true}
        className="invisible relative -translate-y-2"
      />
      <div className="relative flex h-[62px] w-[62px] items-center justify-center rounded-full bg-[#EE3425] text-base font-medium text-white">
        End
        <div className="absolute h-20 w-20 rounded-full border-4 border-[#EE3425]"></div>
      </div>
    </>
  );
});
