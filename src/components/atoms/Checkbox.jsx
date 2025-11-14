import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Checkbox = forwardRef(({ 
  label,
  checked = false,
  onChange,
  className = "",
  disabled = false,
  ...props 
}, ref) => {
  return (
    <label className={cn(
      "flex items-center space-x-3 cursor-pointer group",
      disabled && "cursor-not-allowed opacity-50",
      className
    )}>
      <div className="relative">
        <input
          ref={ref}
          type="checkbox"
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className="sr-only"
          {...props}
        />
        
        <div className={cn(
          "w-5 h-5 border-2 rounded transition-all duration-200 flex items-center justify-center",
          "group-hover:border-primary group-focus:ring-2 group-focus:ring-primary group-focus:ring-offset-2",
          checked 
            ? "bg-gradient-to-br from-primary to-blue-600 border-primary shadow-lg" 
            : "border-slate-300 bg-white hover:border-primary"
        )}>
          {checked && (
            <ApperIcon 
              name="Check" 
              className="w-3 h-3 text-white check-animation"
            />
          )}
        </div>
      </div>
      
      {label && (
        <span className="text-sm text-slate-700 select-none">
          {label}
        </span>
      )}
    </label>
  );
});

Checkbox.displayName = "Checkbox";

export default Checkbox;