import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Textarea from '@/components/atoms/Textarea';
import Select from '@/components/atoms/Select';
import FileUploadInput from '@/components/atoms/FileUploadInput';

const ProjectModal = ({ isOpen, onClose, onSave, project }) => {
  const [formData, setFormData] = useState({
    name_c: '',
    description_c: '',
    status_c: 'Active',
    dueDate_c: '',
    invoices_c: null,
    quotes_c: null
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (project) {
      setFormData({
        name_c: project.name_c || '',
        description_c: project.description_c || '',
        status_c: project.status_c || 'Active',
        dueDate_c: project.dueDate_c ? project.dueDate_c.split('T')[0] : '',
        invoices_c: project.invoices_c || null,
        quotes_c: project.quotes_c || null
      });
    } else {
      setFormData({
        name_c: '',
        description_c: '',
        status_c: 'Active',
        dueDate_c: '',
        invoices_c: null,
        quotes_c: null
      });
    }
    setErrors({});
  }, [project, isOpen]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleFilesSelected = (type, files) => {
    if (files.length > 0) {
      handleInputChange(type, files[0]);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name_c.trim()) {
      newErrors.name_c = 'Project name is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await onSave(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
          >
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center">
                <h2 className="text-xl font-bold text-slate-900">
                  {project ? 'Edit Project' : 'Create New Project'}
                </h2>
                <button
                  onClick={onClose}
                  className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <ApperIcon name="X" size={24} className="text-slate-600" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {/* Project Name */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Project Name *
                  </label>
                  <Input
                    type="text"
                    value={formData.name_c}
                    onChange={(e) => handleInputChange('name_c', e.target.value)}
                    placeholder="Enter project name"
                    error={errors.name_c}
                  />
                  {errors.name_c && (
                    <p className="mt-1 text-sm text-red-600">{errors.name_c}</p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Description
                  </label>
                  <Textarea
                    value={formData.description_c}
                    onChange={(e) => handleInputChange('description_c', e.target.value)}
                    placeholder="Enter project description"
                    rows={3}
                  />
                </div>

                {/* Status and Due Date */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Status
                    </label>
                    <Select
                      value={formData.status_c}
                      onChange={(e) => handleInputChange('status_c', e.target.value)}
                      options={[
                        { value: 'Active', label: 'Active' },
                        { value: 'Inactive', label: 'Inactive' },
                        { value: 'Completed', label: 'Completed' }
                      ]}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Due Date
                    </label>
                    <Input
                      type="date"
                      value={formData.dueDate_c}
                      onChange={(e) => handleInputChange('dueDate_c', e.target.value)}
                    />
                  </div>
                </div>

                {/* Invoice Upload */}
                <div>
                  <FileUploadInput
                    onFilesSelected={(files) => handleFilesSelected('invoices_c', files)}
                    maxFiles={1}
                  />
                  {formData.invoices_c && (
                    <div className="mt-2 p-2 bg-blue-50 rounded-lg flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ApperIcon name="FileText" size={16} className="text-blue-600" />
                        <span className="text-sm text-slate-700">{formData.invoices_c.name}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleInputChange('invoices_c', null)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <ApperIcon name="X" size={16} />
                      </button>
                    </div>
                  )}
                </div>

                {/* Quote Upload */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Quotes (Optional)
                  </label>
                  <FileUploadInput
                    onFilesSelected={(files) => handleFilesSelected('quotes_c', files)}
                    maxFiles={1}
                  />
                  {formData.quotes_c && (
                    <div className="mt-2 p-2 bg-green-50 rounded-lg flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ApperIcon name="FileText" size={16} className="text-green-600" />
                        <span className="text-sm text-slate-700">{formData.quotes_c.name}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleInputChange('quotes_c', null)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <ApperIcon name="X" size={16} />
                      </button>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="flex gap-3 pt-6 border-t border-slate-200">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={onClose}
                    disabled={isSubmitting}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={isSubmitting}
                    className="flex-1"
                  >
                    {isSubmitting ? 'Saving...' : project ? 'Update Project' : 'Create Project'}
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ProjectModal;