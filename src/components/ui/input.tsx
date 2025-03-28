import * as React from "react";

import { cn } from "~/lib/utils";
import { Label } from "./label";

function Input({
  className,
  error,
  label,
  type,
  ...props
}: React.ComponentProps<"input"> & {
  label?: React.ReactNode;
  error?: string;
}) {
  const input = (
    <div className="w-full">
      <input
        type={type}
        data-slot="input"
        aria-invalid={!!error}
        className={cn(
          "file:text-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-border bg-input text-input-foreground flex h-[45px] w-full min-w-0 rounded-[6px] border px-3 py-2 text-base leading-[150%] shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-[#BDBDBD] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
          "focus-visible:ring-none focus-visible:ring-[0px]",
          "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
          className,
        )}
        {...props}
      />

      {error && (
        <p className="text-destructive mt-1 text-xs font-semibold">{error}</p>
      )}
    </div>
  );

  if (label) {
    return (
      <div className="flex flex-col gap-y-1.5">
        <Label className="inline-block">{label}</Label>
        {input}
      </div>
    );
  }

  return input;
}

export { Input };
