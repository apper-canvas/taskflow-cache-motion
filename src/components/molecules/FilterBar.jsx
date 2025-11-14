import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Select from "@/components/atoms/Select";
import { cn } from "@/utils/cn";

const FilterBar = ({ 
  currentFilter, 
  onFilterChange, 
  sortBy, 
  onSortChange, 
  taskCounts = {},
  className = "" 
}) => {
  const filters = [
    { id: "all", label: "All Tasks", count: taskCounts.all || 0, icon: "List" },
    { id: "active", label: "Active", count: taskCounts.active || 0, icon: "Circle" },
    { id: "completed", label: "Completed", count: taskCounts.completed || 0, icon: "CheckCircle" },
    { id: "today", label: "Today", count: taskCounts.today || 0, icon: "Calendar" },
    { id: "upcoming", label: "Upcoming", count: taskCounts.upcoming || 0, icon: "Clock" },
  ];

  const sortOptions = [
    { value: "created", label: "Date Created" },
    { value: "priority", label: "Priority" },
    { value: "dueDate", label: "Due Date" },
    { value: "alphabetical", label: "A-Z" },
  ];

  return (
    <div className={cn("flex items-center justify-between py-4", className)}>
      <div className="flex items-center space-x-2 overflow-x-auto">
        {filters.map((filter) => (
          <Button
            key={filter.id}
            variant={currentFilter === filter.id ? "primary" : "ghost"}
            size="sm"
            onClick={() => onFilterChange(filter.id)}
            className={cn(
              "flex items-center space-x-2 whitespace-nowrap",
              currentFilter === filter.id && "shadow-lg"
            )}
          >
            <ApperIcon name={filter.icon} className="w-4 h-4" />
            <span>{filter.label}</span>
            {filter.count > 0 && (
              <span className={cn(
                "ml-1 px-2 py-0.5 rounded-full text-xs font-medium",
                currentFilter === filter.id 
                  ? "bg-white/20 text-white" 
                  : "bg-primary/10 text-primary"
              )}>
                {filter.count}
              </span>
            )}
          </Button>
        ))}
      </div>
      
      <div className="flex items-center space-x-3 ml-4">
        <Select
          options={sortOptions}
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="min-w-[140px]"
        />
      </div>
    </div>
  );
};

export default FilterBar;