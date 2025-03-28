import React, { useState, useCallback } from "react";
import { useReactFlow } from "@xyflow/react";
import { Minus, Plus } from "lucide-react";
import { Slider } from "../ui/slider";
import { toast } from "sonner";

const CustomControls = () => {
  const {
    zoomIn: rfZoomIn,
    zoomOut: rfZoomOut,
    zoomTo,
    getViewport,
    getZoom,
  } = useReactFlow();
  const [zoomLevel, setZoomLevel] = useState(getZoom());

  const handleZoomIn = useCallback(() => {
    void rfZoomIn();
    setZoomLevel(getViewport().zoom);
  }, [rfZoomIn, getViewport]);

  const handleZoomOut = useCallback(() => {
    void rfZoomOut();
    setZoomLevel(getViewport().zoom);
  }, [rfZoomOut, getViewport]);

  const handleSliderChange = useCallback(
    (newZoomLevel: number) => {
      setZoomLevel(newZoomLevel);
      void zoomTo(newZoomLevel);
    },
    [rfZoomIn],
  );

  return (
    <div className="bg-card text-card-foreground border-border absolute right-5 bottom-5 z-40 flex h-10 items-center gap-x-3 rounded-lg border shadow-md">
      <button
        onClick={() => toast.warning("Not implemented yet")}
        className="relative ml-4 flex h-2.5 w-2.5 items-center justify-center rounded-full bg-[#849E4C] text-base font-medium text-white"
      >
        <div className="absolute h-5 w-5 rounded-full border-4 border-[#849E4C]"></div>
      </button>
      <button
        onClick={handleZoomOut}
        className="border-border border-x-2 p-[10px]"
      >
        <Minus className="text-[#221F20]" size={12} />
      </button>

      <Slider
        defaultValue={[zoomLevel]}
        min={0.5}
        max={2}
        step={0.1}
        value={[zoomLevel]}
        className="w-[230px]"
        onValueChange={(value) => {
          handleSliderChange(value[0]!);
        }}
      />
      <button
        onClick={handleZoomIn}
        className="border-border border-l-2 p-[10px]"
      >
        <Plus className="text-[#221F20]" size={12} />
      </button>
    </div>
  );
};

export default CustomControls;
