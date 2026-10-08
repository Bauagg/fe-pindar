import React from "react";
import { STATUS } from "../constants";
import type { StatusKey } from "../types";

export default function StatusBadge({ value }: { value: StatusKey | string }) {
  const s = STATUS[value as StatusKey] ?? STATUS.pending;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ring-1 ring-inset ${s.badge}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
}
