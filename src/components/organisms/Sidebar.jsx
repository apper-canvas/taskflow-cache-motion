import React, { useState } from "react";
import { motion } from "framer-motion";
import { getTasksByList } from "@/utils/taskUtils";
import ApperIcon from "@/components/ApperIcon";
import ListItem from "@/components/molecules/ListItem";
import Button from "@/components/atoms/Button";

const Sidebar = ({ 
  lists = [], 
  tasks = [], 
  currentFilter, 
  onFilterChange, 
  onCreateList, 
  className = "" 
}) => {
const [isListsExpanded, setIsListsExpanded] = useState(true);

  const mainNavItems = [
    { id: "all", label: "All Tasks", icon: "List", count: tasks.filter(t => !t.archived_c).length },
    { id: "today", label: "Today", icon: "Calendar", count: tasks.filter(t => {
      if (!t.dueDate_c || t.archived_c || t.completed_c) return false;
      const today = new Date();
      const dueDate = new Date(t.dueDate_c);
      return dueDate.toDateString() === today.toDateString();
    }).length },
    { id: "upcoming", label: "Upcoming", icon: "Clock", count: tasks.filter(t => {
      if (!t.dueDate_c || t.archived_c || t.completed_c) return false;
      const today = new Date();
      const dueDate = new Date(t.dueDate_c);
      return dueDate > today;
    }).length },
    { id: "archived", label: "Archive", icon: "Archive", count: tasks.filter(t => t.archived_c).length },
  ];

  return (
    <motion.aside 
      initial={{ x: -250, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={`w-64 bg-white border-r border-slate-200 overflow-y-auto ${className}`}
    >
      <div className="p-6 space-y-8">
        {/* Main Navigation */}
        <nav className="space-y-1">
          {mainNavItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onFilterChange(item.id)}
              className={`w-full text-left px-3 py-2.5 rounded-lg group transition-all ${
                currentFilter === item.id
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-slate-700 hover:bg-slate-50"
              }`}
            >
              <ApperIcon 
                name={item.icon} 
                className={`w-5 h-5 ${
                  currentFilter === item.id ? "text-primary" : "text-slate-500 group-hover:text-slate-700"
                }`}
              />
              <span className="font-medium flex-1">{item.label}</span>
              {item.count > 0 && (
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                  currentFilter === item.id
                    ? "bg-primary/10 text-primary"
                    : "bg-slate-100 text-slate-600 group-hover:bg-slate-200"
                }`}>
                  {item.count}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Lists Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setIsListsExpanded(!isListsExpanded)}
              className="flex items-center space-x-2 text-slate-600 hover:text-slate-900 transition-colors"
            >
              <ApperIcon 
                name={isListsExpanded ? "ChevronDown" : "ChevronRight"} 
                className="w-4 h-4" 
              />
              <span className="font-medium text-sm">Lists</span>
            </button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={onCreateList}
              className="p-1.5 hover:bg-slate-100"
            >
              <ApperIcon name="Plus" className="w-4 h-4" />
            </Button>
          </div>

{isListsExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-1 overflow-hidden"
            >
              {lists.map((list) => {
                const taskCount = getTasksByList(tasks, list.Id).length;
                
                return (
                  <div key={list.Id}>
                    <ListItem
                      list={list}
                      taskCount={taskCount}
                      isActive={currentFilter === `list-${list.Id}`}
                      onClick={() => onFilterChange(`list-${list.Id}`)}
                    />
                  </div>
                );
              })}
              
              {lists.length === 0 && (
                <p className="text-sm text-slate-500 px-3 py-2">
                  No custom lists yet
                </p>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;