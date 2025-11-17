import React, { useRef } from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { cn } from "@/utils/cn";

const FileUploadInput = ({ onFilesSelected, disabled = false, maxFiles = 10 }) => {
  const fileInputRef = useRef(null);
  const [isDragActive, setIsDragActive] = React.useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (disabled) return;

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFiles(files);
    }
  };

  const handleFileChange = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFiles(files);
    }
  };

  const handleFiles = (fileList) => {
    const filesArray = Array.from(fileList).slice(0, maxFiles);
    const fileObjects = filesArray.map((file) => ({
      id: `${Date.now()}-${Math.random()}`,
      name: file.name,
      size: file.size,
      type: file.type,
      uploadedAt: new Date().toISOString(),
    }));

    onFilesSelected(fileObjects);

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-slate-700">
        Attachments (Optional)
      </label>

      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={cn(
          "relative border-2 border-dashed rounded-lg p-6 text-center transition-colors",
          isDragActive
            ? "border-blue-500 bg-blue-50"
            : "border-slate-300 bg-slate-50 hover:border-slate-400",
          disabled && "opacity-50 cursor-not-allowed"
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileChange}
          disabled={disabled}
          className="hidden"
          aria-label="Upload files"
        />

        <div className="flex flex-col items-center space-y-2">
          <ApperIcon
            name="Upload"
            className={cn(
              "w-8 h-8",
              isDragActive ? "text-blue-500" : "text-slate-400"
            )}
          />
          <div className="space-y-1">
            <p className="text-sm font-medium text-slate-900">
              Drag files here or click to browse
            </p>
            <p className="text-xs text-slate-500">
              Supported: Images, documents, and any file type (max {maxFiles} files)
            </p>
          </div>
        </div>

        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled}
          className="mt-4"
        >
          <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
          Choose Files
        </Button>
      </div>
    </div>
  );
};

export default FileUploadInput;