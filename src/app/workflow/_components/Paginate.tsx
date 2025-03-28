import React from "react";
import { cn } from "~/lib/utils";

interface PaginationProps {
  totalPages: number;
  activePage: number;
  onPageChange: (page: number) => void;
}

const Paginate: React.FC<PaginationProps> = ({
  totalPages,
  activePage,
  onPageChange,
}) => {
  const getPages = () => {
    const pages: (number | "...")[] = [];
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    pages.push(1);
    if (activePage > 3) pages.push("...");

    const start = Math.max(2, activePage - 1);
    const end = Math.min(totalPages - 1, activePage + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (activePage < totalPages - 2) pages.push("...");
    pages.push(totalPages);

    return pages;
  };

  return (
    <div className="flex items-center gap-2">
      <button
        disabled={activePage === 1}
        onClick={() => onPageChange(activePage - 1)}
        className="px-3 py-2 disabled:opacity-50"
      >
        ◀
      </button>
      {getPages().map((page, index) =>
        page === "..." ? (
          <span key={index} className="px-3 py-2">
            ...
          </span>
        ) : (
          <button
            key={index}
            onClick={() => onPageChange(page)}
            className={cn(
              "rounded px-4 py-2 text-center text-sm",
              activePage === page && "bg-[#FEF3E9]",
            )}
          >
            {page}
          </button>
        ),
      )}
      <button
        disabled={activePage === totalPages}
        onClick={() => onPageChange(activePage + 1)}
        className="px-3 py-2 disabled:opacity-50"
      >
        ▶
      </button>
    </div>
  );
};

export default Paginate;
