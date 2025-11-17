import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '@/components/organisms/Header';
import ProjectModal from '@/components/organisms/ProjectModal';
import Button from '@/components/atoms/Button';
import Loading from '@/components/ui/Loading';
import ErrorView from '@/components/ui/ErrorView';
import Empty from '@/components/ui/Empty';
import ApperIcon from '@/components/ApperIcon';
import { projectService } from '@/services/api/projectService';
import Badge from '@/components/atoms/Badge';
import { formatDate } from '@/utils/dateUtils';

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await projectService.getAll();
      setProjects(data || []);
    } catch (err) {
      setError(err.message);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = () => {
    setSelectedProject(null);
    setIsModalOpen(true);
  };

  const handleEditProject = (project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const handleDeleteProject = async (projectId) => {
    if (!confirm('Are you sure you want to delete this project?')) {
      return;
    }

    try {
      await projectService.delete(projectId);
      toast.success('Project deleted successfully');
      await loadProjects();
    } catch (err) {
      toast.error(err.message || 'Failed to delete project');
    }
  };

  const handleSaveProject = async (projectData) => {
    try {
      if (selectedProject) {
        await projectService.update(selectedProject.Id, projectData);
        toast.success('Project updated successfully');
      } else {
        await projectService.create(projectData);
        toast.success('Project created successfully');
      }
      setIsModalOpen(false);
      setSelectedProject(null);
      await loadProjects();
    } catch (err) {
      toast.error(err.message || 'Failed to save project');
    }
  };

  const filteredProjects = projects.filter(project =>
    project.name_c?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.description_c?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Completed':
        return 'bg-blue-100 text-blue-800';
      case 'Inactive':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header
        currentFilter="projects"
        title="Projects"
        description="Manage your projects and upload invoices & quotes"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Create Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <input
            type="text"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Button
            variant="primary"
            onClick={handleCreateProject}
            className="flex items-center gap-2 whitespace-nowrap"
          >
            <ApperIcon name="Plus" size={18} />
            New Project
          </Button>
        </div>

        {/* Content */}
        {loading ? (
          <Loading />
        ) : error ? (
          <ErrorView error={error} onRetry={loadProjects} />
        ) : filteredProjects.length === 0 ? (
          <Empty
            icon="Package"
            title="No projects found"
            description={searchQuery ? 'Try adjusting your search criteria' : 'Create your first project to get started'}
          />
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <AnimatePresence>
              {filteredProjects.map((project) => (
                <motion.div
                  key={project.Id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-slate-900 mb-2">
                        {project.name_c}
                      </h3>
                      <Badge className={getStatusColor(project.status_c)}>
                        {project.status_c}
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditProject(project)}
                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <ApperIcon name="Edit2" size={18} className="text-slate-600" />
                      </button>
                      <button
                        onClick={() => handleDeleteProject(project.Id)}
                        className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <ApperIcon name="Trash2" size={18} className="text-red-600" />
                      </button>
                    </div>
                  </div>

                  {project.description_c && (
                    <p className="text-slate-600 text-sm mb-4 line-clamp-2">
                      {project.description_c}
                    </p>
                  )}

                  {project.dueDate_c && (
                    <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
                      <ApperIcon name="Calendar" size={16} />
                      {formatDate(project.dueDate_c)}
                    </div>
                  )}

                  {/* File Indicators */}
                  <div className="flex gap-4 pt-4 border-t border-slate-200">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 text-sm">
                        <ApperIcon name="FileText" size={16} className="text-blue-600" />
                        <span className="text-slate-600">
                          {project.invoices_c ? '1 Invoice' : 'No Invoice'}
                        </span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 text-sm">
                        <ApperIcon name="FileText" size={16} className="text-green-600" />
                        <span className="text-slate-600">
                          {project.quotes_c ? '1 Quote' : 'No Quote'}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* Project Modal */}
      <ProjectModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedProject(null);
        }}
        onSave={handleSaveProject}
        project={selectedProject}
      />
    </div>
  );
};

export default ProjectsPage;