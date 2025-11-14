import listsData from "@/services/mockData/lists.json";

// Simulate network delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class ListService {
  constructor() {
    this.lists = [...listsData];
    this.initializeFromStorage();
  }

  initializeFromStorage() {
    try {
      const stored = localStorage.getItem("taskflow_lists");
      if (stored) {
        this.lists = JSON.parse(stored);
      }
    } catch (error) {
      console.error("Error loading lists from localStorage:", error);
      this.lists = [...listsData];
    }
  }

  saveToStorage() {
    try {
      localStorage.setItem("taskflow_lists", JSON.stringify(this.lists));
    } catch (error) {
      console.error("Error saving lists to localStorage:", error);
    }
  }

  async getAll() {
    await delay(180);
    return [...this.lists];
  }

  async getById(id) {
    await delay(120);
    const list = this.lists.find(list => list.id === id);
    if (!list) {
      throw new Error(`List with id ${id} not found`);
    }
    return { ...list };
  }

  async create(listData) {
    await delay(250);
    
    // Generate new ID
    const maxId = this.lists.length > 0 
      ? Math.max(...this.lists.map(l => parseInt(l.id, 10)).filter(id => !isNaN(id)))
      : 0;
    const newId = (maxId + 1).toString();
    
    const newList = {
      id: newId,
      ...listData,
      taskCount: 0,
      createdAt: new Date().toISOString(),
    };
    
    this.lists.push(newList);
    this.saveToStorage();
    
    return { ...newList };
  }

  async update(id, updateData) {
    await delay(220);
    
    const index = this.lists.findIndex(list => list.id === id);
    if (index === -1) {
      throw new Error(`List with id ${id} not found`);
    }
    
    const updatedList = {
      ...this.lists[index],
      ...updateData,
      id,
    };
    
    this.lists[index] = updatedList;
    this.saveToStorage();
    
    return { ...updatedList };
  }

  async delete(id) {
    await delay(180);
    
    const index = this.lists.findIndex(list => list.id === id);
    if (index === -1) {
      throw new Error(`List with id ${id} not found`);
    }
    
    this.lists.splice(index, 1);
    this.saveToStorage();
    
    return true;
  }

  async updateTaskCount(listId, count) {
    await delay(100);
    
    const index = this.lists.findIndex(list => list.id === listId);
    if (index !== -1) {
      this.lists[index].taskCount = count;
      this.saveToStorage();
    }
    
    return this.lists[index] || null;
  }
}

export const listService = new ListService();