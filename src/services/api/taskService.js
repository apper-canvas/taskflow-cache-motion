import tasksData from "@/services/mockData/tasks.json";

// Simulate network delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class TaskService {
  constructor() {
    this.tasks = [...tasksData];
    this.initializeFromStorage();
  }

  initializeFromStorage() {
    try {
      const stored = localStorage.getItem("taskflow_tasks");
      if (stored) {
        this.tasks = JSON.parse(stored);
      }
    } catch (error) {
      console.error("Error loading tasks from localStorage:", error);
      this.tasks = [...tasksData];
    }
  }

  saveToStorage() {
    try {
      localStorage.setItem("taskflow_tasks", JSON.stringify(this.tasks));
    } catch (error) {
      console.error("Error saving tasks to localStorage:", error);
    }
  }

  async getAll() {
    await delay(200);
    return [...this.tasks];
  }

  async getById(id) {
    await delay(150);
    const task = this.tasks.find(task => task.id === id);
    if (!task) {
      throw new Error(`Task with id ${id} not found`);
    }
    return { ...task };
  }

async create(taskData) {
    await delay(300);
    
    // Generate new ID
    const maxId = this.tasks.length > 0 
      ? Math.max(...this.tasks.map(t => parseInt(t.id, 10)).filter(id => !isNaN(id)))
      : 0;
    const newId = (maxId + 1).toString();
    
    const newTask = {
      id: newId,
      ...taskData,
      files: taskData.files || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    this.tasks.push(newTask);
    this.saveToStorage();
    
    return { ...newTask };
  }

async update(id, updateData) {
    await delay(250);
    
    const index = this.tasks.findIndex(task => task.id === id);
    if (index === -1) {
      throw new Error(`Task with id ${id} not found`);
    }
    
    const updatedTask = {
      ...this.tasks[index],
      ...updateData,
      id,
      files: updateData.files !== undefined ? updateData.files : (this.tasks[index].files || []),
      updatedAt: new Date().toISOString(),
    };
    
    this.tasks[index] = updatedTask;
    this.saveToStorage();
    
    return { ...updatedTask };
  }

  async delete(id) {
    await delay(200);
    
    const index = this.tasks.findIndex(task => task.id === id);
    if (index === -1) {
      throw new Error(`Task with id ${id} not found`);
    }
    
    this.tasks.splice(index, 1);
    this.saveToStorage();
    
    return true;
  }

  async toggleComplete(id) {
    await delay(200);
    
    const task = this.tasks.find(task => task.id === id);
    if (!task) {
      throw new Error(`Task with id ${id} not found`);
    }
    
    const updatedTask = {
      ...task,
      completed: !task.completed,
      updatedAt: new Date().toISOString(),
    };
    
    return this.update(id, updatedTask);
  }

  async archive(id) {
    await delay(200);
    
    const task = this.tasks.find(task => task.id === id);
    if (!task) {
      throw new Error(`Task with id ${id} not found`);
    }
    
    return this.update(id, { archived: true });
  }

  async unarchive(id) {
    await delay(200);
    
    const task = this.tasks.find(task => task.id === id);
    if (!task) {
      throw new Error(`Task with id ${id} not found`);
    }
    
    return this.update(id, { archived: false });
  }
}

export const taskService = new TaskService();