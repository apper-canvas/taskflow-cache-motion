import React, { useState } from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Checkbox from "@/components/atoms/Checkbox";
import Badge from "@/components/atoms/Badge";
import { formatDate, getDueDateStatus } from "@/utils/dateUtils";
import { cn } from "@/utils/cn";

const TaskCard = ({ 
  task, 
  lists = [], 
  onToggleComplete, 
  onClick,
  className = "" 
}) => {
  const [isCompleting, setIsCompleting] = useState(false);
  
const list = lists.find(l => l.Id === task.listId_c);
  const dueDateStatus = getDueDateStatus(task.dueDate_c);
  const handleToggleComplete = async (e) => {
    e.stopPropagation();
    setIsCompleting(true);
    
    // Add a small delay to show the animation
    setTimeout(() => {
onToggleComplete(task.Id);
    }, 200);
  };

  const getPriorityVariant = (priority) => {
    switch (priority) {
      case "high": return "high";
      case "medium": return "medium";
      case "low": return "low";
      default: return "default";
    }
  };

  const getDueDateClassName = () => {
    switch (dueDateStatus) {
      case "overdue":
        return "text-error bg-error/10 border-error/20 animate-pulse-soft";
      case "today":
        return "text-warning bg-warning/10 border-warning/20";
      case "tomorrow":
        return "text-info bg-info/10 border-info/20";
      default:
        return "text-slate-600 bg-slate-50 border-slate-200";
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-sm hover:shadow-lg border border-slate-200/60",
        "transition-all duration-200 cursor-pointer group",
        "hover:border-primary/20 hover:bg-white/90",
list && `border-l-4 list-indicator-${list.color_c}`,
        task.completed_c && "opacity-60",
        isCompleting && "task-complete-animation",
        className
      )}
      onClick={onClick}
    >
      <div className="flex items-start space-x-4">
        <Checkbox
checked={task.completed_c}
          onChange={handleToggleComplete}
          className="mt-1"
        />
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h3 className={cn(
                "text-base font-semibold text-slate-900 mb-1 group-hover:text-primary transition-colors",
                task.completed && "line-through text-slate-500"
)}>
                {task.title_c}
              </h3>
              
{task.description_c && (
                <p className="text-sm text-slate-600 mb-3 line-clamp-2">
                  {task.description_c}
                </p>
              )}
              
<div className="flex items-center space-x-3 text-sm flex-wrap gap-2">
{list && (
                  <span className="inline-flex items-center text-slate-600">
                    <ApperIcon name={list.icon_c} className="w-4 h-4 mr-1" />
                    {list.name_c}
                  </span>
                )}
                
{task.dueDate_c && (
                  <span className={cn(
                    "inline-flex items-center px-2 py-1 rounded-md border text-xs font-medium",
                    getDueDateClassName()
                  )}>
                    <ApperIcon name="Calendar" className="w-3 h-3 mr-1" />
                    {formatDate(task.dueDate_c)}
                  </span>
                )}

{task.files_c && task.files_c.length > 0 && (
                  <span className="inline-flex items-center px-2 py-1 rounded-md bg-amber-50 border border-amber-200 text-xs font-medium text-amber-700">
                    <ApperIcon name="Paperclip" className="w-3 h-3 mr-1" />
                    {task.files_c.length} file{task.files_c.length !== 1 ? 's' : ''}
                  </span>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-2 ml-4">
<Badge variant={getPriorityVariant(task.priority_c)} size="sm">
                {task.priority_c}
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TaskCard;