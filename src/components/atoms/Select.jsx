import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Select = forwardRef(({ 
  label,
  error,
  options = [],
  className = "",
  placeholder = "Select an option",
  ...props 
}, ref) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-slate-700">
          {label}
        </label>
      )}
      
      <select
        ref={ref}
        className={cn(
          "w-full px-4 py-3 border border-slate-300 rounded-lg bg-white text-slate-900",
          "focus:ring-2 focus:ring-primary focus:border-primary transition-colors duration-200",
          "disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed",
          error && "border-error focus:ring-error focus:border-error",
          className
        )}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      
      {error && (
        <p className="text-sm text-error font-medium">
          {error}
        </p>
      )}
    </div>
  );
});

Select.displayName = "Select";

export default Select;