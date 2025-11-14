import React, { useState } from "react";
import ApperIcon from "@/components/ApperIcon";
import Input from "@/components/atoms/Input";
import { cn } from "@/utils/cn";

const SearchBar = ({ 
  onSearch, 
  placeholder = "Search tasks...", 
  className = "",
  autoFocus = false 
}) => {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value);
  };

  const handleClear = () => {
    setQuery("");
    onSearch("");
  };

  return (
    <div className={cn("relative", className)}>
      <div className="relative">
        <ApperIcon 
          name="Search" 
          className={cn(
            "absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors duration-200",
            isFocused || query ? "text-primary" : "text-slate-400"
          )}
        />
        
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className={cn(
            "w-full pl-10 pr-10 py-3 border border-slate-300 rounded-lg bg-white text-slate-900 placeholder-slate-500",
            "focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200",
            "hover:border-slate-400",
            isFocused && "shadow-lg"
          )}
        />
        
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors duration-200"
          >
            <ApperIcon name="X" className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchBar;