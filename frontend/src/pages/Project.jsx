import { useEffect, useState } from 'react';
import axios from '../api/axios';
import { toast } from 'react-hot-toast';
import {
    Plus,
    Search,
    Filter,
    MoreVertical,
    Trash2,
    Edit3,
    ExternalLink,
    CheckCircle2,
    Layout as LayoutIcon,
    Clock,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import ConfirmModal from '../components/ConfirmModal';

const Project = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, projectId: null });
    const [deleteLoading, setDeleteLoading] = useState(false);

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [form, setForm] = useState({
        name: '',
        description: '',
        status: 'Active',
    });

    const fetchProjects = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`/project/getAll?page=${page}&search=${search}${statusFilter !== 'All' ? `&status=${statusFilter}` : ''}`);
            setProjects(res?.data?.data || []);
            setTotalPages(res?.data?.totalPages || 1);
        } catch (error) {
            toast.error('Failed to load projects');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            fetchProjects();
        }, 300);
        return () => clearTimeout(delayDebounce);
    }, [search, statusFilter, page]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await axios.put(`/project/update/${editingId}`, form);
                toast.success('Project updated');
            } else {
                await axios.post('/project/create', form);
                toast.success('Project created');
            }
            setShowModal(false);
            setEditingId(null);
            setForm({ name: '', description: '', status: 'Active' });
            fetchProjects();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Action failed');
        }
    };

    const handleDeleteProject = async () => {
        try {
            setDeleteLoading(true);
            await axios.delete(`/project/delete/${deleteModal.projectId}`);
            toast.success('Project deleted');
            setDeleteModal({ isOpen: false, projectId: null });
            fetchProjects();
        } catch (error) {
            toast.error('Failed to delete project');
        } finally {
            setDeleteLoading(false);
        }
    };

    const handleEdit = (project) => {
        setEditingId(project._id);
        setForm({
            name: project.name,
            description: project.description || '',
            status: project.status,
        });
        setShowModal(true);
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Your Projects</h1>
                    <p className="text-slate-500 mt-1">Manage and track your active projects</p>
                </div>
                <button
                    onClick={() => {
                        setEditingId(null);
                        setForm({ name: '', description: '', status: 'Active' });
                        setShowModal(true);
                    }}
                    className="bg-primary-600 text-white px-5 py-2.5 rounded-xl font-semibold flex items-center justify-center gap-2 shadow-lg shadow-primary-200 hover:bg-primary-700 transition-all w-full md:w-auto"
                >
                    <Plus size={20} />
                    New Project
                </button>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search projects..."
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setPage(1);
                        }}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Filter size={18} className="text-slate-400" />
                    <select
                        className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary-500 transition-all font-medium text-slate-600"
                        value={statusFilter}
                        onChange={(e) => {
                            setStatusFilter(e.target.value);
                            setPage(1);
                        }}
                    >
                        <option value="All">All Status</option>
                        <option value="Active">Active</option>
                        <option value="Completed">Completed</option>
                    </select>
                </div>
            </div>

            {loading && projects.length === 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-48 bg-white rounded-3xl border border-slate-100 animate-pulse" />
                    ))}
                </div>
            ) : projects.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
                    <LayoutIcon className="mx-auto text-slate-300 mb-4" size={48} />
                    <p className="text-slate-500 font-medium">No projects found</p>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project) => (
                        <div key={project._id} className="group bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300">
                            <div className="flex justify-between items-start mb-4">
                                <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${project.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-600'
                                    }`}>
                                    {project.status}
                                </div>
                                <div className="flex gap-2 transition-opacity">
                                    <button onClick={() => handleEdit(project)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-primary-600 transition-colors">
                                        <Edit3 size={16} />
                                    </button>
                                    <button onClick={() => setDeleteModal({ isOpen: true, projectId: project._id })} className="p-2 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-500 transition-colors">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>

                            <h3 className="text-xl font-bold text-slate-900 mb-2 truncate group-hover:text-primary-600 transition-colors">
                                {project.name}
                            </h3>
                            <p className="text-slate-500 text-sm line-clamp-2 mb-6 h-10">
                                {project.description || "No description provided."}
                            </p>

                            <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                                <div className="flex items-center gap-2 text-slate-400 text-xs font-medium">
                                    <Clock size={14} />
                                    {format(new Date(project.createdAt), 'MMM dd, yyyy')}
                                </div>
                                <Link
                                    to={`/project/${project._id}`}
                                    className="flex items-center gap-1.5 text-primary-600 font-bold text-sm hover:gap-2 transition-all"
                                >
                                    View Tasks
                                    <ExternalLink size={14} />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-4 pt-8">
                    <button
                        disabled={page === 1}
                        onClick={() => setPage(p => p - 1)}
                        className="p-2 border border-slate-200 rounded-xl hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <span className="text-sm font-bold text-slate-600 px-4">
                        Page {page} of {totalPages}
                    </span>
                    <button
                        disabled={page === totalPages}
                        onClick={() => setPage(p => p + 1)}
                        className="p-2 border border-slate-200 rounded-xl hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
            )}

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-8">
                            <h2 className="text-2xl font-bold text-slate-900 mb-6">
                                {editingId ? 'Edit Project' : 'Create Project'}
                            </h2>
                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Project Name</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                                        placeholder="e.g. Website Redesign"
                                        required
                                        value={form.name}
                                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
                                    <textarea
                                        rows="3"
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all resize-none"
                                        placeholder="Briefly describe the project..."
                                        value={form.description}
                                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Status</label>
                                    <select
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                                        value={form.status}
                                        onChange={(e) => setForm({ ...form, status: e.target.value })}
                                    >
                                        <option value="Active">Active</option>
                                        <option value="Completed">Completed</option>
                                    </select>
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="flex-1 px-4 py-3 border border-slate-200 rounded-xl font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 px-4 py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 shadow-lg shadow-primary-100 transition-all"
                                    >
                                        {editingId ? 'Save Changes' : 'Create Project'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            <ConfirmModal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ isOpen: false, projectId: null })}
                onConfirm={handleDeleteProject}
                title="Delete Project"
                message="Are you sure you want to delete this project and all its associated tasks? This action cannot be undone."
                loading={deleteLoading}
            />
        </div>
    );
};

export default Project;

