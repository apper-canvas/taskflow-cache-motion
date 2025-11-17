import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import TaskCard from "@/components/molecules/TaskCard";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import Empty from "@/components/ui/Empty";

const TaskList = ({ 
  tasks = [], 
  lists = [],
  loading = false,
  error = null,
  onToggleComplete,
  onTaskClick,
  onAddTask,
  onRetry,
  className = "" 
}) => {
  if (loading) {
    return <Loading className={className} />;
  }

  if (error) {
    return (
      <ErrorView 
        error={error}
        onRetry={onRetry}
        className={className}
      />
    );
  }

  if (tasks.length === 0) {
    return (
      <Empty
        icon="CheckSquare"
        title="No tasks found"
        description="Create your first task to get started with your productivity journey."
        actionLabel="Add Task"
        onAction={onAddTask}
        className={className}
      />
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <AnimatePresence mode="popLayout">
{tasks.map((task) => (
          <motion.div
            key={task.Id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <TaskCard
              key={task.Id}
              task={task}
              lists={lists}
              onToggleComplete={onToggleComplete}
              onClick={() => onTaskClick(task)}
            />
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default TaskList;