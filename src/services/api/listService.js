import { getApperClient } from '@/services/apperClient';

class ListService {
  async getAll() {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        console.error('ApperClient not initialized');
        return [];
      }

      const response = await apperClient.fetchRecords('lists_c', {
        fields: [
          { field: { Name: 'name_c' } },
          { field: { Name: 'color_c' } },
          { field: { Name: 'icon_c' } }
        ],
        pagingInfo: {
          limit: 100,
          offset: 0
        }
      });

      if (!response?.success) {
        console.error('Error fetching lists:', response?.message);
        return [];
      }

      // Map database fields to UI field names
      return (response.data || []).map(record => ({
        Id: record.Id,
        name_c: record.name_c,
        color_c: record.color_c,
        icon_c: record.icon_c,
        CreatedOn: record.CreatedOn,
        ModifiedOn: record.ModifiedOn
      }));
    } catch (error) {
      console.error('Error in listService.getAll:', error);
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

      const response = await apperClient.getRecordById('lists_c', parseInt(id), {
        fields: [
          { field: { Name: 'name_c' } },
          { field: { Name: 'color_c' } },
          { field: { Name: 'icon_c' } }
        ]
      });

      if (!response?.data) {
        console.error(`List with id ${id} not found`);
        return null;
      }

      return {
        Id: response.data.Id,
        name_c: response.data.name_c,
        color_c: response.data.color_c,
        icon_c: response.data.icon_c,
        CreatedOn: response.data.CreatedOn,
        ModifiedOn: response.data.ModifiedOn
      };
    } catch (error) {
      console.error(`Error in listService.getById(${id}):`, error);
      return null;
    }
  }

  async create(listData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        console.error('ApperClient not initialized');
        return null;
      }

      const payload = {
        records: [
          {
            name_c: listData.name_c,
            color_c: listData.color_c,
            icon_c: listData.icon_c
          }
        ]
      };

      const response = await apperClient.createRecord('lists_c', payload);

      if (!response?.success) {
        console.error('Error creating list:', response?.message);
        return null;
      }

      if (response.results && response.results.length > 0) {
        const created = response.results[0];
        if (created.success && created.data) {
          return {
            Id: created.data.Id,
            name_c: created.data.name_c,
            color_c: created.data.color_c,
            icon_c: created.data.icon_c,
            CreatedOn: created.data.CreatedOn,
            ModifiedOn: created.data.ModifiedOn
          };
        }
      }

      return null;
    } catch (error) {
      console.error('Error in listService.create:', error);
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
            name_c: updateData.name_c,
            color_c: updateData.color_c,
            icon_c: updateData.icon_c
          }
        ]
      };

      const response = await apperClient.updateRecord('lists_c', payload);

      if (!response?.success) {
        console.error('Error updating list:', response?.message);
        return null;
      }

      if (response.results && response.results.length > 0) {
        const updated = response.results[0];
        if (updated.success && updated.data) {
          return {
            Id: updated.data.Id,
            name_c: updated.data.name_c,
            color_c: updated.data.color_c,
            icon_c: updated.data.icon_c,
            CreatedOn: updated.data.CreatedOn,
            ModifiedOn: updated.data.ModifiedOn
          };
        }
      }

      return null;
    } catch (error) {
      console.error(`Error in listService.update(${id}):`, error);
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

      const response = await apperClient.deleteRecord('lists_c', {
        RecordIds: [parseInt(id)]
      });

      if (!response?.success) {
        console.error('Error deleting list:', response?.message);
        return false;
      }

      return true;
    } catch (error) {
      console.error(`Error in listService.delete(${id}):`, error);
      return false;
    }
  }
}

export const listService = new ListService();