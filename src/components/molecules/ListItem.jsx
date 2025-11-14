import React from "react";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const ListItem = ({ 
  list, 
  isActive = false, 
  onClick, 
  taskCount = 0,
  className = "" 
}) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-left group",
        "hover:bg-slate-100/80 hover:shadow-sm",
        isActive && "bg-gradient-to-r from-primary/10 to-blue-600/5 border-l-3 border-primary shadow-sm",
        className
      )}
    >
      <div className={cn(
        "w-8 h-8 rounded-lg flex items-center justify-center transition-colors duration-200",
        `bg-${list.color}-100`,
        isActive && `bg-${list.color}-200`
      )}>
        <ApperIcon 
          name={list.icon} 
          className={cn(
            "w-4 h-4",
            `text-${list.color}-600`,
            isActive && `text-${list.color}-700`
          )}
        />
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <span className={cn(
            "font-medium text-sm truncate transition-colors duration-200",
            isActive ? "text-primary" : "text-slate-700 group-hover:text-slate-900"
          )}>
            {list.name}
          </span>
          
          {taskCount > 0 && (
            <span className={cn(
              "ml-2 px-2 py-0.5 rounded-full text-xs font-medium transition-colors duration-200",
              isActive 
                ? "bg-primary/10 text-primary" 
                : "bg-slate-100 text-slate-600 group-hover:bg-slate-200"
            )}>
              {taskCount}
            </span>
          )}
        </div>
      </div>
    </button>
  );
};

export default ListItem;