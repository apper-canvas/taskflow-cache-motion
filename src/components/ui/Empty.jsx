import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Empty = ({ 
  icon = "CheckSquare",
  title = "No tasks yet", 
  description = "Create your first task to get started with your productivity journey.",
  actionLabel = "Add Task",
  onAction,
  className = "" 
}) => {
  return (
    <div className={`min-h-[500px] flex flex-col items-center justify-center p-8 text-center ${className}`}>
      <div className="w-32 h-32 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full flex items-center justify-center mb-8 shadow-lg">
        <ApperIcon 
          name={icon} 
          className="w-16 h-16 text-primary"
        />
      </div>
      
      <h3 className="text-2xl font-bold text-slate-900 mb-4">
        {title}
      </h3>
      
      <p className="text-secondary text-lg mb-8 max-w-md leading-relaxed">
        {description}
      </p>
      
      {onAction && (
        <Button
          onClick={onAction}
          className="bg-gradient-to-r from-primary to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
        >
          <ApperIcon name="Plus" className="w-5 h-5 mr-2" />
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default Empty;