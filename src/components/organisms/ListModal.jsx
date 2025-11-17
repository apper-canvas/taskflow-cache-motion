import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import { generateListId } from "@/utils/taskUtils";

const ListModal = ({ 
  isOpen, 
  onClose, 
  onSave, 
  list = null 
}) => {
const [formData, setFormData] = useState({
    name_c: "",
    color_c: "blue",
    icon_c: "List",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const colorOptions = [
    { value: "blue", label: "Blue" },
    { value: "green", label: "Green" },
    { value: "purple", label: "Purple" },
    { value: "orange", label: "Orange" },
    { value: "pink", label: "Pink" },
    { value: "red", label: "Red" },
  ];

  const iconOptions = [
    { value: "List", label: "List" },
    { value: "Briefcase", label: "Work" },
    { value: "Home", label: "Home" },
    { value: "ShoppingCart", label: "Shopping" },
    { value: "Heart", label: "Personal" },
    { value: "Book", label: "Learning" },
    { value: "Dumbbell", label: "Fitness" },
    { value: "Plane", label: "Travel" },
    { value: "Car", label: "Transport" },
    { value: "Gamepad2", label: "Entertainment" },
  ];

  useEffect(() => {
if (list) {
      setFormData({
        name_c: list.name_c || "",
        color_c: list.color_c || "blue",
        icon_c: list.icon_c || "List",
      });
    } else {
      setFormData({
        name: "",
        color: "blue",
        icon: "List",
      });
    }
    setErrors({});
  }, [list, isOpen]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "List name is required";
    }
    
    if (formData.name.trim().length > 50) {
      newErrors.name = "Name must be less than 50 characters";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const listData = {
...formData,
        name_c: formData.name_c.trim(),
      };
      
      if (list) {
        // Edit mode
const updatedList = {
          ...list,
          ...listData,
        };
        await onSave(updatedList);
      } else {
        // Create mode
const newList = {
          ...listData,
        };
        await onSave(newList);
      }
      
      onClose();
    } catch (error) {
      console.error("Error saving list:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

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
          className="relative w-full max-w-md mx-4 bg-white rounded-2xl shadow-2xl z-10"
        >
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">
                {list ? "Edit List" : "Create New List"}
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

            {/* Preview */}
            <div className="flex items-center space-x-3 p-4 bg-slate-50 rounded-lg">
<div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-${formData.color_c}-100`}>
                <ApperIcon 
                  name={formData.icon_c} 
                  className={`w-4 h-4 text-${formData.color_c}-600`}
                />
              </div>
<span className="font-medium text-slate-900">
                {formData.name_c || "List Name"}
              </span>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              <Input
                label="List Name"
value={formData.name_c}
                onChange={(e) => handleInputChange("name_c", e.target.value)}
                placeholder="Enter list name..."
                error={errors.name}
                autoFocus
              />

              <div className="grid grid-cols-2 gap-4">
                <Select
                  label="Color"
                  options={colorOptions}
value={formData.color_c}
                  onChange={(e) => handleInputChange("color_c", e.target.value)}
                />

                <Select
                  label="Icon"
                  options={iconOptions}
value={formData.icon_c}
                  onChange={(e) => handleInputChange("icon_c", e.target.value)}
                />
              </div>
            </div>

            {/* Actions */}
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
                    {list ? "Update List" : "Create List"}
                  </>
                )}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ListModal;