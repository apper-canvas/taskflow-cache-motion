import React, { useState } from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import ListItem from "@/components/molecules/ListItem";
import { getTasksByList } from "@/utils/taskUtils";

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
    { id: "all", label: "All Tasks", icon: "List", count: tasks.filter(t => !t.archived).length },
    { id: "today", label: "Today", icon: "Calendar", count: tasks.filter(t => {
      if (!t.dueDate || t.archived || t.completed) return false;
      const today = new Date();
      const dueDate = new Date(t.dueDate);
      return dueDate.toDateString() === today.toDateString();
    }).length },
    { id: "upcoming", label: "Upcoming", icon: "Clock", count: tasks.filter(t => {
      if (!t.dueDate || t.archived || t.completed) return false;
      const today = new Date();
      const dueDate = new Date(t.dueDate);
      return dueDate > today;
    }).length },
    { id: "archived", label: "Archive", icon: "Archive", count: tasks.filter(t => t.archived).length },
  ];

  return (
    <div className={`w-72 bg-white/90 backdrop-blur-sm border-r border-slate-200/60 h-full overflow-y-auto ${className}`}>
      <div className="p-6">
        {/* App Header */}
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
            <ApperIcon name="CheckSquare" className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              TaskFlow
            </h1>
            <p className="text-xs text-slate-500">Task Management</p>
          </div>
        </div>

        {/* Main Navigation */}
        <nav className="space-y-1 mb-8">
          {mainNavItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onFilterChange(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 text-left group ${
                currentFilter === item.id
                  ? "bg-gradient-to-r from-primary/10 to-blue-600/5 border-l-3 border-primary shadow-sm text-primary"
                  : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
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
                const taskCount = getTasksByList(tasks, list.id).length;
                return (
                  <ListItem
                    key={list.id}
                    list={list}
                    taskCount={taskCount}
                    isActive={currentFilter === `list-${list.id}`}
                    onClick={() => onFilterChange(`list-${list.id}`)}
                  />
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