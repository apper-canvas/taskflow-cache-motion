import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { cn } from "@/utils/cn";

const FileList = ({ files = [], onRemoveFile, disabled = false }) => {
  if (!files || files.length === 0) {
    return null;
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
  };

  const getFileIcon = (fileName) => {
    const ext = fileName.split(".").pop().toLowerCase();
    if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext))
      return "Image";
    if (["pdf"].includes(ext)) return "FileText";
    if (["doc", "docx"].includes(ext)) return "FileText";
    if (["xls", "xlsx"].includes(ext)) return "BarChart3";
    if (["ppt", "pptx"].includes(ext)) return "Presentation";
    if (["zip", "rar", "7z"].includes(ext)) return "Archive";
    return "File";
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-slate-700">
        Attached Files ({files.length})
      </label>

      <div className="space-y-2">
        {files.map((file) => (
          <div
            key={file.id}
            className={cn(
              "flex items-center justify-between p-3 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors",
              disabled && "opacity-50"
            )}
          >
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              <ApperIcon
                name={getFileIcon(file.name)}
                className="w-5 h-5 text-slate-400 flex-shrink-0"
              />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-slate-900 truncate">
                  {file.name}
                </p>
                <p className="text-xs text-slate-500">
                  {formatFileSize(file.size)}
                </p>
              </div>
            </div>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onRemoveFile(file.id)}
              disabled={disabled}
              className="flex-shrink-0 ml-2 p-1 hover:bg-red-100 text-red-600"
            >
              <ApperIcon name="Trash2" className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FileList;