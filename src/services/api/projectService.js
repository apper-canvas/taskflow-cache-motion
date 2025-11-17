import { getApperClient } from '@/services/apperClient';

class ProjectService {
  async getAll() {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords('projects_c', {
        fields: [
          { field: { Name: 'Id' } },
          { field: { Name: 'name_c' } },
          { field: { Name: 'description_c' } },
          { field: { Name: 'status_c' } },
          { field: { Name: 'dueDate_c' } },
          { field: { Name: 'invoices_c' } },
          { field: { Name: 'quotes_c' } },
          { field: { Name: 'CreatedOn' } },
          { field: { Name: 'ModifiedOn' } }
        ],
        orderBy: [{ fieldName: 'CreatedOn', sorttype: 'DESC' }],
        pagingInfo: { limit: 100, offset: 0 }
      });

      if (!response.success) {
        console.error('Failed to fetch projects:', response);
        throw new Error(response.message || 'Failed to fetch projects');
      }

      return response.data || [];
    } catch (error) {
      console.error('Error fetching projects:', error.message);
      throw error;
    }
  }

  async getById(id) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.getRecordById('projects_c', id, {
        fields: [
          { field: { Name: 'Id' } },
          { field: { Name: 'name_c' } },
          { field: { Name: 'description_c' } },
          { field: { Name: 'status_c' } },
          { field: { Name: 'dueDate_c' } },
          { field: { Name: 'invoices_c' } },
          { field: { Name: 'quotes_c' } },
          { field: { Name: 'CreatedOn' } },
          { field: { Name: 'ModifiedOn' } }
        ]
      });

      if (!response.success) {
        console.error(`Failed to fetch project with Id: ${id}:`, response);
        throw new Error(response.message || 'Failed to fetch project');
      }

      return response.data || null;
    } catch (error) {
      console.error(`Error fetching project ${id}:`, error.message);
      throw error;
    }
  }

  async create(projectData) {
    try {
      const apperClient = getApperClient();
      
      const payload = {
        records: [{
          name_c: projectData.name_c,
          description_c: projectData.description_c || '',
          status_c: projectData.status_c || 'Active',
          dueDate_c: projectData.dueDate_c || null,
          invoices_c: projectData.invoices_c || null,
          quotes_c: projectData.quotes_c || null
        }]
      };

      const response = await apperClient.createRecord('projects_c', payload);

      if (!response.success) {
        console.error('Failed to create project:', response);
        throw new Error(response.message || 'Failed to create project');
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} records:`, failed);
          failed.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }

        return successful.length > 0 ? successful[0].data : null;
      }

      return null;
    } catch (error) {
      console.error('Error creating project:', error.message);
      throw error;
    }
  }

  async update(id, projectData) {
    try {
      const apperClient = getApperClient();
      
      const payload = {
        records: [{
          Id: id,
          name_c: projectData.name_c,
          description_c: projectData.description_c || '',
          status_c: projectData.status_c || 'Active',
          dueDate_c: projectData.dueDate_c || null,
          invoices_c: projectData.invoices_c || null,
          quotes_c: projectData.quotes_c || null
        }]
      };

      const response = await apperClient.updateRecord('projects_c', payload);

      if (!response.success) {
        console.error(`Failed to update project with Id: ${id}:`, response);
        throw new Error(response.message || 'Failed to update project');
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} records:`, failed);
          failed.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }

        return successful.length > 0 ? successful[0].data : null;
      }

      return null;
    } catch (error) {
      console.error('Error updating project:', error.message);
      throw error;
    }
  }

  async delete(id) {
    try {
      const apperClient = getApperClient();
      
      const response = await apperClient.deleteRecord('projects_c', {
        RecordIds: [id]
      });

      if (!response.success) {
        console.error(`Failed to delete project with Id: ${id}:`, response);
        throw new Error(response.message || 'Failed to delete project');
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} records:`, failed);
          failed.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
      }

      return true;
    } catch (error) {
      console.error('Error deleting project:', error.message);
      throw error;
    }
  }
}

export const projectService = new ProjectService();