export const filterTasks = (tasks, filter, searchQuery = "") => {
  let filtered = [...tasks];

  // Apply status filter
  switch (filter) {
    case "active":
      filtered = filtered.filter(task => !task.completed && !task.archived);
      break;
    case "completed":
      filtered = filtered.filter(task => task.completed && !task.archived);
      break;
    case "archived":
      filtered = filtered.filter(task => task.archived);
      break;
    case "today":
      filtered = filtered.filter(task => {
        if (!task.dueDate || task.archived) return false;
        const today = new Date();
        const dueDate = new Date(task.dueDate);
        return (
          dueDate.toDateString() === today.toDateString() && !task.completed
        );
      });
      break;
    case "upcoming":
      filtered = filtered.filter(task => {
        if (!task.dueDate || task.archived || task.completed) return false;
        const today = new Date();
        const dueDate = new Date(task.dueDate);
        return dueDate > today;
      });
      break;
    default:
      filtered = filtered.filter(task => !task.archived);
      break;
  }

  // Apply search filter
  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase();
    filtered = filtered.filter(
      task =>
        task.title.toLowerCase().includes(query) ||
        (task.description && task.description.toLowerCase().includes(query))
    );
  }

  return filtered;
};

export const sortTasks = (tasks, sortBy) => {
  const sorted = [...tasks];

  switch (sortBy) {
    case "priority":
      return sorted.sort((a, b) => {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      });
    case "dueDate":
      return sorted.sort((a, b) => {
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate) - new Date(b.dueDate);
      });
    case "created":
      return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    case "alphabetical":
      return sorted.sort((a, b) => a.title.localeCompare(b.title));
    default:
      return sorted;
  }
};

export const getTasksByList = (tasks, listId) => {
  return tasks.filter(task => task.listId === listId && !task.archived);
};

export const getTaskCounts = (tasks) => {
  const counts = {
    all: tasks.filter(task => !task.archived).length,
    active: tasks.filter(task => !task.completed && !task.archived).length,
    completed: tasks.filter(task => task.completed && !task.archived).length,
    today: tasks.filter(task => {
      if (!task.dueDate || task.archived || task.completed) return false;
      const today = new Date();
      const dueDate = new Date(task.dueDate);
      return dueDate.toDateString() === today.toDateString();
    }).length,
    upcoming: tasks.filter(task => {
      if (!task.dueDate || task.archived || task.completed) return false;
      const today = new Date();
      const dueDate = new Date(task.dueDate);
      return dueDate > today;
    }).length,
    archived: tasks.filter(task => task.archived).length,
  };
  return counts;
};

export const generateTaskId = () => {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
};

export const generateListId = () => {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
};