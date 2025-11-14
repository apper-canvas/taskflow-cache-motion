import React from "react";

const Loading = ({ className = "" }) => {
  return (
    <div className={`animate-pulse space-y-4 p-6 ${className}`}>
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div className="h-8 bg-gradient-to-r from-slate-200 to-slate-300 rounded-lg w-48"></div>
        <div className="h-10 bg-gradient-to-r from-primary/20 to-primary/30 rounded-lg w-32"></div>
      </div>
      
      {/* Filter bar skeleton */}
      <div className="flex items-center space-x-4 pt-4">
        <div className="h-10 bg-gradient-to-r from-slate-200 to-slate-300 rounded-lg w-24"></div>
        <div className="h-10 bg-gradient-to-r from-slate-200 to-slate-300 rounded-lg w-24"></div>
        <div className="h-10 bg-gradient-to-r from-slate-200 to-slate-300 rounded-lg w-24"></div>
      </div>
      
      {/* Task cards skeleton */}
      <div className="space-y-3 pt-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-white/60 backdrop-blur-xs rounded-xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4 flex-1">
                <div className="w-5 h-5 bg-gradient-to-r from-slate-200 to-slate-300 rounded border-2 mt-1"></div>
                <div className="flex-1 space-y-3">
                  <div className="h-5 bg-gradient-to-r from-slate-200 to-slate-300 rounded w-3/4"></div>
                  <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded w-1/2"></div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="h-6 bg-gradient-to-r from-accent/20 to-accent/30 rounded-full w-16"></div>
                <div className="h-6 bg-gradient-to-r from-primary/20 to-primary/30 rounded w-20"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Loading;