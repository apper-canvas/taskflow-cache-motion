import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Textarea from "@/components/atoms/Textarea";
import Select from "@/components/atoms/Select";
import FileUploadInput from "@/components/atoms/FileUploadInput";
import FileList from "@/components/molecules/FileList";
import { formatFullDate } from "@/utils/dateUtils";
import { generateTaskId } from "@/utils/taskUtils";
const TaskModal = ({ 
  isOpen, 
  onClose, 
  onSave, 
  task = null, 
  lists = [],
  mode = "create" // create, edit, view
}) => {
const [formData, setFormData] = useState({
    title_c: "",
    description_c: "",
    priority_c: "medium",
    dueDate_c: "",
    listId_c: "",
    files_c: [],
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

useEffect(() => {
    if (task && (mode === "edit" || mode === "view")) {
setFormData({
        title_c: task.title_c || "",
        description_c: task.description_c || "",
        priority_c: task.priority_c || "medium",
        dueDate_c: task.dueDate_c ? formatFullDate(task.dueDate_c) : "",
        listId_c: task.listId_c || "",
        files_c: task.files_c || [],
      });
    } else {
      // Create mode - reset form
      setFormData({
        title: "",
        description: "",
        priority: "medium",
        dueDate: "",
listId_c: lists.length > 0 ? lists[0].Id : "",
        files_c: [],
      });
    }
    setErrors({});
  }, [task, mode, lists, isOpen]);

const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  const handleFilesSelected = (newFiles) => {
    setFormData(prev => ({
      ...prev,
      files: [...(prev.files || []), ...newFiles]
    }));
    toast.success(`${newFiles.length} file(s) added to task`);
  };

  const handleRemoveFile = (fileId) => {
    setFormData(prev => ({
      ...prev,
      files: (prev.files || []).filter(f => f.id !== fileId)
    }));
    toast.info("File removed");
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = "Task title is required";
    }
    
    if (formData.title.trim().length > 200) {
      newErrors.title = "Title must be less than 200 characters";
    }
    
    if (formData.description.length > 1000) {
      newErrors.description = "Description must be less than 1000 characters";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const taskData = {
...formData,
        title_c: formData.title_c.trim(),
        description_c: formData.description_c.trim(),
        dueDate_c: formData.dueDate_c ? new Date(formData.dueDate_c).toISOString() : null,
        files: formData.files || [],
      };
      
      if (mode === "create") {
const newTask = {
          ...taskData,
          completed_c: false,
          archived_c: false,
        };
        await onSave(newTask);
      } else if (mode === "edit") {
        const updatedTask = {
...task,
          ...taskData,
        };
        await onSave(updatedTask);
      }
      
      onClose();
    } catch (error) {
      console.error("Error saving task:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const priorityOptions = [
    { value: "low", label: "Low Priority" },
    { value: "medium", label: "Medium Priority" },
    { value: "high", label: "High Priority" },
  ];

const listOptions = lists.map(list => ({
    value: list.Id,
    label: list.name_c,
  }));

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm modal-backdrop"
          onClick={onClose}
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-lg mx-4 bg-white rounded-2xl shadow-2xl z-10 max-h-[90vh] overflow-y-auto"
        >
<form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">
                {mode === "create" && "Create New Task"}
                {mode === "edit" && "Edit Task"}
                {mode === "view" && "Task Details"}
              </h2>
              
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="p-2 hover:bg-slate-100"
              >
                <ApperIcon name="X" className="w-4 h-4" />
              </Button>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              <Input
                label="Task Title"
value={formData.title_c}
                onChange={(e) => handleInputChange("title_c", e.target.value)}
                placeholder="Enter task title..."
                error={errors.title}
                disabled={mode === "view"}
                autoFocus={mode === "create"}
              />

              <Textarea
label="Description (Optional)"
                value={formData.description_c}
                onChange={(e) => handleInputChange("description", e.target.value)}
onChange={(e) => handleInputChange("description_c", e.target.value)}
                rows={3}
                error={errors.description}
                disabled={mode === "view"}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  label="Priority"
                  options={priorityOptions}
value={formData.priority_c}
                  onChange={(e) => handleInputChange("priority_c", e.target.value)}
                  disabled={mode === "view"}
                />

                {listOptions.length > 0 && (
                  <Select
                    label="List"
                    options={listOptions}
value={formData.listId_c}
                    onChange={(e) => handleInputChange("listId_c", e.target.value)}
                    disabled={mode === "view"}
                  />
                )}
              </div>

              <Input
                type="date"
                label="Due Date (Optional)"
value={formData.dueDate_c}
                onChange={(e) => handleInputChange("dueDate_c", e.target.value)}
                disabled={mode === "view"}
              />

              {mode !== "view" && (
                <FileUploadInput
                  onFilesSelected={handleFilesSelected}
                  disabled={mode === "view"}
                />
              )}

{formData.files_c && formData.files_c.length > 0 && (
                <FileList
                  files={formData.files_c}
                  onRemoveFile={handleRemoveFile}
                  disabled={mode === "view"}
                />
              )}
            </div>

            {/* Actions */}
            {mode !== "view" && (
              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-200">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={onClose}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="min-w-[100px]"
                >
                  {isSubmitting ? (
                    <>
                      <ApperIcon name="Loader2" className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <ApperIcon name="Save" className="w-4 h-4 mr-2" />
                      {mode === "create" ? "Create Task" : "Save Changes"}
                    </>
                  )}
                </Button>
              </div>
            )}

            {mode === "view" && (
              <div className="flex items-center justify-end pt-4 border-t border-slate-200">
                <Button
                  type="button"
                  onClick={onClose}
                >
                  Close
                </Button>
              </div>
            )}
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default TaskModal;