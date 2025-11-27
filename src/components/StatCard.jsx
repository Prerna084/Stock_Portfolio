import React from "react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

export default function StatCard({ title, value, delta, positive = true, Icon }) {
  return (
    <div className="card p-4">
      <div className="card-header">
        <div className="flex items-center gap-2">
          {Icon ? (
            <div className="h-8 w-8 rounded-lg bg-brand-500/10 text-brand-400 flex items-center justify-center">
              <Icon className="h-4 w-4" />
            </div>
          ) : null}
          <span className="text-sm text-gray-400">{title}</span>
        </div>
        {typeof delta !== "undefined" && delta !== null ? (
          <span className={positive ? "chip-green" : "chip-red"}>
            {positive ? (
              <ArrowUpRight className="h-3 w-3 mr-1" />
            ) : (
              <ArrowDownRight className="h-3 w-3 mr-1" />
            )}
            {delta}
          </span>
        ) : null}
      </div>
      <div className="text-2xl font-semibold text-black">{value}</div>
    </div>
  );
}
