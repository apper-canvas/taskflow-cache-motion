import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";

const Header = ({ 
  currentFilter, 
  searchQuery, 
  onSearchChange, 
  onAddTask, 
  onToggleMobileMenu,
  className = "" 
}) => {
  const getFilterTitle = (filter) => {
    switch (filter) {
      case "all": return "All Tasks";
      case "active": return "Active Tasks";
      case "completed": return "Completed Tasks";
      case "today": return "Today's Tasks";
      case "upcoming": return "Upcoming Tasks";
      case "archived": return "Archived Tasks";
      default:
        if (filter.startsWith("list-")) return "List Tasks";
        return "Tasks";
    }
  };

  return (
    <header className={`bg-white/90 backdrop-blur-sm border-b border-slate-200/60 px-6 py-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleMobileMenu}
            className="lg:hidden p-2"
          >
            <ApperIcon name="Menu" className="w-5 h-5" />
          </Button>
          
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              {getFilterTitle(currentFilter)}
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Manage your tasks with ease
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="hidden md:block w-80">
            <SearchBar
              onSearch={onSearchChange}
              placeholder="Search tasks..."
              className="w-full"
            />
          </div>
          
          <Button
            onClick={onAddTask}
            className="flex items-center space-x-2 bg-gradient-to-r from-primary to-blue-600 hover:from-blue-600 hover:to-blue-700"
          >
            <ApperIcon name="Plus" className="w-4 h-4" />
            <span className="hidden sm:inline">Add Task</span>
          </Button>
        </div>
      </div>
      
      {/* Mobile search */}
      <div className="md:hidden mt-4">
        <SearchBar
          onSearch={onSearchChange}
          placeholder="Search tasks..."
          className="w-full"
        />
      </div>
    </header>
  );
};

export default Header;