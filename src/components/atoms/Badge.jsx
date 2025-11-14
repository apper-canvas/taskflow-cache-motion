import React from "react";
import { cn } from "@/utils/cn";

const Badge = ({ 
  children,
  variant = "default",
  size = "md",
  className = "",
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center font-medium rounded-full transition-all duration-200";
  
  const variants = {
    default: "bg-slate-100 text-slate-800",
    primary: "bg-gradient-to-r from-primary/10 to-blue-600/10 text-primary border border-primary/20",
    success: "bg-gradient-to-r from-success/10 to-emerald-600/10 text-success border border-success/20",
    warning: "bg-gradient-to-r from-warning/10 to-amber-600/10 text-warning border border-warning/20",
    error: "bg-gradient-to-r from-error/10 to-red-600/10 text-error border border-error/20",
    high: "priority-high shadow-sm",
    medium: "priority-medium shadow-sm",
    low: "priority-low shadow-sm",
  };
  
  const sizes = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1 text-sm",
    lg: "px-4 py-2 text-sm",
  };
  
  return (
    <span
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;