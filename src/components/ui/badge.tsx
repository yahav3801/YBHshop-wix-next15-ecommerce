import { cn } from "@/lib/utils";
import React from "react";
interface BadgeProps {
  children: React.ReactNode;
  className?: string;
}
const Badge = ({ children, className }: BadgeProps) => {
  return (
    <span
      className={cn(
        "w-fit bg-primary px-2 py-1 text-xs text-primary-foreground",
        className,
      )}
    >
      {children}
    </span>
  );
};

export default Badge;
