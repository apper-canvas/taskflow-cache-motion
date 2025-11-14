import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const ErrorView = ({ 
  error = "Something went wrong", 
  onRetry, 
  className = "" 
}) => {
  return (
    <div className={`min-h-[400px] flex flex-col items-center justify-center p-8 text-center ${className}`}>
      <div className="w-24 h-24 bg-gradient-to-br from-error/10 to-error/20 rounded-full flex items-center justify-center mb-6">
        <ApperIcon 
          name="AlertTriangle" 
          className="w-12 h-12 text-error"
        />
      </div>
      
      <h3 className="text-xl font-bold text-slate-900 mb-3">
        Oops! Something went wrong
      </h3>
      
      <p className="text-secondary text-base mb-8 max-w-md leading-relaxed">
        {error}. Don't worry, this happens sometimes. Please try again.
      </p>
      
      {onRetry && (
        <Button
          onClick={onRetry}
          className="bg-gradient-to-r from-primary to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
        >
          <ApperIcon name="RotateCcw" className="w-4 h-4 mr-2" />
          Try Again
        </Button>
      )}
    </div>
  );
};

export default ErrorView;