import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { toast } from "react-toastify";
import Header from "@/components/organisms/Header";
import Sidebar from "@/components/organisms/Sidebar";
import TaskList from "@/components/organisms/TaskList";
import FilterBar from "@/components/molecules/FilterBar";
import TaskModal from "@/components/organisms/TaskModal";
import ListModal from "@/components/organisms/ListModal";
import { taskService } from "@/services/api/taskService";
import { listService } from "@/services/api/listService";
import { filterTasks, sortTasks, getTaskCounts } from "@/utils/taskUtils";

const TasksPage = () => {
  const { toggleMobileMenu } = useOutletContext();
  
  // State
  const [tasks, setTasks] = useState([]);
  const [lists, setLists] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filters and search
  const [currentFilter, setCurrentFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("created");
  
  // Modal states
  const [taskModal, setTaskModal] = useState({ isOpen: false, mode: "create", task: null });
  const [listModal, setListModal] = useState({ isOpen: false, list: null });

  // Load initial data
  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [tasksData, listsData] = await Promise.all([
        taskService.getAll(),
        listService.getAll()
      ]);
      
      setTasks(tasksData);
      setLists(listsData);
    } catch (err) {
      setError("Failed to load tasks");
      console.error("Error loading data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Update filtered tasks when dependencies change
  useEffect(() => {
    let filtered = [...tasks];
    
    // Apply list-specific filter
    if (currentFilter.startsWith("list-")) {
      const listId = currentFilter.replace("list-", "");
      filtered = filtered.filter(task => task.listId === listId && !task.archived);
    } else {
      filtered = filterTasks(tasks, currentFilter, searchQuery);
    }
    
    // Sort tasks
    filtered = sortTasks(filtered, sortBy);
    
    setFilteredTasks(filtered);
  }, [tasks, currentFilter, searchQuery, sortBy]);

  // Task operations
  const handleToggleComplete = async (taskId) => {
    try {
      const task = tasks.find(t => t.id === taskId);
      if (!task) return;
      
      const updatedTask = await taskService.update(taskId, {
        ...task,
        completed: !task.completed,
        updatedAt: new Date().toISOString(),
      });
      
      setTasks(prev => prev.map(t => t.id === taskId ? updatedTask : t));
      
      toast.success(
        updatedTask.completed 
          ? "Task completed! Great job! 🎉" 
          : "Task marked as active"
      );
    } catch (err) {
      toast.error("Failed to update task");
      console.error("Error updating task:", err);
    }
  };

  const handleSaveTask = async (taskData) => {
    try {
      if (taskModal.mode === "create") {
        const newTask = await taskService.create(taskData);
        setTasks(prev => [...prev, newTask]);
        toast.success("Task created successfully! 🚀");
      } else if (taskModal.mode === "edit") {
        const updatedTask = await taskService.update(taskData.id, taskData);
        setTasks(prev => prev.map(t => t.id === taskData.id ? updatedTask : t));
        toast.success("Task updated successfully! ✨");
      }
    } catch (err) {
      toast.error("Failed to save task");
      console.error("Error saving task:", err);
    }
  };

  const handleSaveList = async (listData) => {
    try {
      if (listModal.list) {
        // Edit existing list
        const updatedList = await listService.update(listData.id, listData);
        setLists(prev => prev.map(l => l.id === listData.id ? updatedList : l));
        toast.success("List updated successfully! ✨");
      } else {
        // Create new list
        const newList = await listService.create(listData);
        setLists(prev => [...prev, newList]);
        toast.success("List created successfully! 🎨");
      }
    } catch (err) {
      toast.error("Failed to save list");
      console.error("Error saving list:", err);
    }
  };

  // Modal handlers
  const openTaskModal = (mode, task = null) => {
    setTaskModal({ isOpen: true, mode, task });
  };

  const closeTaskModal = () => {
    setTaskModal({ isOpen: false, mode: "create", task: null });
  };

  const openListModal = (list = null) => {
    setListModal({ isOpen: true, list });
  };

  const closeListModal = () => {
    setListModal({ isOpen: false, list: null });
  };

  // Get task counts for filter bar
  const taskCounts = getTaskCounts(tasks);

  return (
    <div className="flex h-full">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar
          lists={lists}
          tasks={tasks}
          currentFilter={currentFilter}
          onFilterChange={setCurrentFilter}
          onCreateList={() => openListModal()}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          currentFilter={currentFilter}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onAddTask={() => openTaskModal("create")}
          onToggleMobileMenu={toggleMobileMenu}
        />
        
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-5xl mx-auto p-6">
            <FilterBar
              currentFilter={currentFilter}
              onFilterChange={setCurrentFilter}
              sortBy={sortBy}
              onSortChange={setSortBy}
              taskCounts={taskCounts}
            />
            
            <TaskList
              tasks={filteredTasks}
              lists={lists}
              loading={loading}
              error={error}
              onToggleComplete={handleToggleComplete}
              onTaskClick={(task) => openTaskModal("edit", task)}
              onAddTask={() => openTaskModal("create")}
              onRetry={loadData}
            />
          </div>
        </div>
      </div>

      {/* Modals */}
      <TaskModal
        isOpen={taskModal.isOpen}
        onClose={closeTaskModal}
        onSave={handleSaveTask}
        task={taskModal.task}
        lists={lists}
        mode={taskModal.mode}
      />
      
      <ListModal
        isOpen={listModal.isOpen}
        onClose={closeListModal}
        onSave={handleSaveList}
        list={listModal.list}
      />
    </div>
  );
};

export default TasksPage;