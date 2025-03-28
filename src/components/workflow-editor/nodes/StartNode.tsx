import React, { memo } from "react";
import { Handle, Position } from "@xyflow/react";

export default memo(function EndNode({ ...props }) {
  console.log(props);
  return (
    <>
      <Handle
        type="source"
        position={Position.Bottom}
        onConnect={(params) => console.log("handle onConnect", params)}
        isConnectable={true}
        className="invisible relative translate-y-1"
      />
      <div className="relative flex h-[62px] w-[62px] items-center justify-center rounded-full bg-[#849E4C] text-base font-medium text-white">
        Start
        <div className="absolute h-20 w-20 rounded-full border-4 border-[#849E4C]"></div>
      </div>
    </>
  );
});
