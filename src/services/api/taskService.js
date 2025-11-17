import { getApperClient } from '@/services/apperClient';

class TaskService {
  async getAll() {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        console.error('ApperClient not initialized');
        return [];
      }

      const response = await apperClient.fetchRecords('tasks_c', {
        fields: [
          { field: { Name: 'title_c' } },
          { field: { Name: 'description_c' } },
          { field: { Name: 'priority_c' } },
          { field: { Name: 'dueDate_c' } },
          { field: { Name: 'completed_c' } },
          { field: { Name: 'archived_c' } },
          { field: { Name: 'files_c' } },
          { field: { Name: 'listId_c' } }
        ],
        pagingInfo: {
          limit: 100,
          offset: 0
        }
      });

      if (!response?.success) {
        console.error('Error fetching tasks:', response?.message);
        return [];
      }

      return (response.data || []).map(record => ({
        Id: record.Id,
        title_c: record.title_c,
        description_c: record.description_c,
        priority_c: record.priority_c,
        dueDate_c: record.dueDate_c,
        completed_c: record.completed_c,
        archived_c: record.archived_c,
        files_c: record.files_c || [],
        listId_c: record.listId_c,
        CreatedOn: record.CreatedOn,
        ModifiedOn: record.ModifiedOn
      }));
    } catch (error) {
      console.error('Error in taskService.getAll:', error);
      return [];
    }
  }

  async getById(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        console.error('ApperClient not initialized');
        return null;
      }

      const response = await apperClient.getRecordById('tasks_c', parseInt(id), {
        fields: [
          { field: { Name: 'title_c' } },
          { field: { Name: 'description_c' } },
          { field: { Name: 'priority_c' } },
          { field: { Name: 'dueDate_c' } },
          { field: { Name: 'completed_c' } },
          { field: { Name: 'archived_c' } },
          { field: { Name: 'files_c' } },
          { field: { Name: 'listId_c' } }
        ]
      });

      if (!response?.data) {
        console.error(`Task with id ${id} not found`);
        return null;
      }

      return {
        Id: response.data.Id,
        title_c: response.data.title_c,
        description_c: response.data.description_c,
        priority_c: response.data.priority_c,
        dueDate_c: response.data.dueDate_c,
        completed_c: response.data.completed_c,
        archived_c: response.data.archived_c,
        files_c: response.data.files_c || [],
        listId_c: response.data.listId_c,
        CreatedOn: response.data.CreatedOn,
        ModifiedOn: response.data.ModifiedOn
      };
    } catch (error) {
      console.error(`Error in taskService.getById(${id}):`, error);
      return null;
    }
  }

  async create(taskData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        console.error('ApperClient not initialized');
        return null;
      }

      const payload = {
        records: [
          {
            title_c: taskData.title_c,
            description_c: taskData.description_c || '',
            priority_c: taskData.priority_c,
            dueDate_c: taskData.dueDate_c,
            completed_c: taskData.completed_c || false,
            archived_c: taskData.archived_c || false,
            files_c: taskData.files_c || [],
            listId_c: taskData.listId_c ? parseInt(taskData.listId_c) : null
          }
        ]
      };

      const response = await apperClient.createRecord('tasks_c', payload);

      if (!response?.success) {
        console.error('Error creating task:', response?.message);
        return null;
      }

      if (response.results && response.results.length > 0) {
        const created = response.results[0];
        if (created.success && created.data) {
          return {
            Id: created.data.Id,
            title_c: created.data.title_c,
            description_c: created.data.description_c,
            priority_c: created.data.priority_c,
            dueDate_c: created.data.dueDate_c,
            completed_c: created.data.completed_c,
            archived_c: created.data.archived_c,
            files_c: created.data.files_c || [],
            listId_c: created.data.listId_c,
            CreatedOn: created.data.CreatedOn,
            ModifiedOn: created.data.ModifiedOn
          };
        }
      }

      return null;
    } catch (error) {
      console.error('Error in taskService.create:', error);
      return null;
    }
  }

  async update(id, updateData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        console.error('ApperClient not initialized');
        return null;
      }

      const payload = {
        records: [
          {
            Id: parseInt(id),
            title_c: updateData.title_c,
            description_c: updateData.description_c || '',
            priority_c: updateData.priority_c,
            dueDate_c: updateData.dueDate_c,
            completed_c: updateData.completed_c,
            archived_c: updateData.archived_c,
            files_c: updateData.files_c || [],
            listId_c: updateData.listId_c ? parseInt(updateData.listId_c) : null
          }
        ]
      };

      const response = await apperClient.updateRecord('tasks_c', payload);

      if (!response?.success) {
        console.error('Error updating task:', response?.message);
        return null;
      }

      if (response.results && response.results.length > 0) {
        const updated = response.results[0];
        if (updated.success && updated.data) {
          return {
            Id: updated.data.Id,
            title_c: updated.data.title_c,
            description_c: updated.data.description_c,
            priority_c: updated.data.priority_c,
            dueDate_c: updated.data.dueDate_c,
            completed_c: updated.data.completed_c,
            archived_c: updated.data.archived_c,
            files_c: updated.data.files_c || [],
            listId_c: updated.data.listId_c,
            CreatedOn: updated.data.CreatedOn,
            ModifiedOn: updated.data.ModifiedOn
          };
        }
      }

      return null;
    } catch (error) {
      console.error(`Error in taskService.update(${id}):`, error);
      return null;
    }
  }

  async delete(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        console.error('ApperClient not initialized');
        return false;
      }

      const response = await apperClient.deleteRecord('tasks_c', {
        RecordIds: [parseInt(id)]
      });

      if (!response?.success) {
        console.error('Error deleting task:', response?.message);
        return false;
      }

      return true;
    } catch (error) {
      console.error(`Error in taskService.delete(${id}):`, error);
      return false;
    }
  }

  async toggleComplete(id) {
    try {
      const task = await this.getById(id);
      if (!task) {
        console.error(`Task with id ${id} not found`);
        return null;
      }

      return this.update(id, {
        ...task,
        completed_c: !task.completed_c
      });
    } catch (error) {
      console.error(`Error in taskService.toggleComplete(${id}):`, error);
      return null;
    }
  }

  async archive(id) {
    try {
      const task = await this.getById(id);
      if (!task) {
        console.error(`Task with id ${id} not found`);
        return null;
      }

      return this.update(id, {
        ...task,
        archived_c: true
      });
    } catch (error) {
      console.error(`Error in taskService.archive(${id}):`, error);
      return null;
    }
  }

  async unarchive(id) {
    try {
      const task = await this.getById(id);
      if (!task) {
        console.error(`Task with id ${id} not found`);
        return null;
      }

      return this.update(id, {
        ...task,
        archived_c: false
      });
    } catch (error) {
      console.error(`Error in taskService.unarchive(${id}):`, error);
      return null;
    }
  }
}

export const taskService = new TaskService();