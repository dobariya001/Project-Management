import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from '../api/axios';
import { toast } from 'react-hot-toast';
import {
  ArrowLeft,
  Plus,
  Calendar,
  Trash2,
  GripVertical,
  Edit3,
  Search,
  Filter
} from 'lucide-react';
import { format } from 'date-fns';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import ConfirmModal from '../components/ConfirmModal';

const COLUMNS = ['Pending', 'In Progress', 'Done'];

const ProjectDetails = () => {
  const { id: projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, taskId: null });
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [taskSearch, setTaskSearch] = useState('');
  const [taskPriorityFilter, setTaskPriorityFilter] = useState('All');

  const [form, setForm] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    status: 'Pending',
    dueDate: '',
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const projRes = await axios.get(`/project/get/${projectId}`);
      const tasksRes = await axios.get(`/task/getAll/${projectId}`);

      setProject(projRes.data.data);
      setTasks(tasksRes.data.data || []);
    } catch (error) {
      toast.error('Failed to load project details');
      console.log("Error in fetch task:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [projectId]);

  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const newStatus = destination.droppableId;

    setTasks(tasks.map(t => t._id === draggableId ? { ...t, status: newStatus } : t));

    try {
      await axios.put(`/task/update/${draggableId}`, { status: newStatus });
    } catch (error) {
      toast.error('Update failed');
      console.log("Error in update task:", error);
      fetchData();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTaskId) {
        await axios.put(`/task/update/${editingTaskId}`, form);
        toast.success('Task updated');
      } else {
        await axios.post('/task/create', { ...form, projectId });
        toast.success('Task added');
      }
      setShowModal(false);
      setEditingTaskId(null);
      setForm({ title: '', description: '', priority: 'Medium', status: 'Pending', dueDate: '' });
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Action failed');
    }
  };

  const handleEditTask = (task) => {
    setEditingTaskId(task._id);
    setForm({
      title: task.title,
      description: task.description || '',
      priority: task.priority,
      status: task.status,
      dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
    });
    setShowModal(true);
  };

  const handleDeleteTask = async () => {
    try {
      setDeleteLoading(true);
      await axios.delete(`/task/delete/${deleteModal.taskId}`);
      toast.success('Task deleted');
      setDeleteModal({ isOpen: false, taskId: null });
      fetchData();
    } catch (error) {
      toast.error('Delete failed');
      console.log("Error in delete task:", error);
    } finally {
      setDeleteLoading(false);
    }
  };

  if (loading && !project) return <div className="flex items-center justify-center min-h-[60vh]">Loading...</div>;

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(taskSearch.toLowerCase()) ||
      (task.description && task.description.toLowerCase().includes(taskSearch.toLowerCase()));
    const matchesPriority = taskPriorityFilter === 'All' || task.priority === taskPriorityFilter;
    return matchesSearch && matchesPriority;
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/')} className="p-2 hover:bg-white rounded-xl transition-colors border border-transparent hover:border-slate-200">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{project?.name}</h1>
            <p className="text-slate-500 text-sm">Task Management Board</p>
          </div>
        </div>
        <button
          onClick={() => {
            setEditingTaskId(null);
            setForm({ title: '', description: '', priority: 'Medium', status: 'Pending', dueDate: '' });
            setShowModal(true);
          }}
          className="bg-primary-600 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-lg shadow-primary-200 hover:bg-primary-700 transition-all font-bold"
        >
          <Plus size={20} />
          Add Task
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search tasks..."
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all text-sm"
            value={taskSearch}
            onChange={(e) => setTaskSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={18} className="text-slate-400" />
          <select
            className="bg-white border border-slate-200 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-primary-500 transition-all font-medium text-slate-600 text-sm"
            value={taskPriorityFilter}
            onChange={(e) => setTaskPriorityFilter(e.target.value)}
          >
            <option value="All">All Priority</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid lg:grid-cols-3 gap-6 items-start overflow-x-auto pb-4 custom-scrollbar">
          {COLUMNS.map((col) => (
            <Droppable key={col} droppableId={col}>
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="bg-slate-50/50 rounded-3xl p-4 min-w-[320px] border border-slate-200/50 min-h-125"
                >
                  <div className="flex items-center justify-between mb-4 px-2">
                    <h3 className="font-bold text-slate-700 flex items-center gap-2">
                      {col}
                      <span className="bg-slate-200 text-slate-600 text-[10px] px-2 py-0.5 rounded-full">
                        {filteredTasks.filter(t => t.status === col).length}
                      </span>
                    </h3>
                  </div>

                  <div className="space-y-4">
                    {filteredTasks.filter(t => t.status === col).map((task, index) => (
                      <Draggable key={task._id} draggableId={task._id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`bg-white p-5 rounded-2xl shadow-sm border group transition-all ${snapshot.isDragging ? 'shadow-2xl border-primary-400 -rotate-1' : 'border-slate-100'
                              }`}
                          >
                            <div className="flex justify-between items-start mb-3">
                              <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${task.priority === 'High' ? 'bg-red-50 text-red-500' :
                                task.priority === 'Medium' ? 'bg-amber-50 text-amber-500' : 'bg-blue-50 text-blue-500'
                                }`}>
                                {task.priority}
                              </span>
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => handleEditTask(task)}
                                  className="p-1 hover:bg-blue-50 rounded text-slate-400 hover:text-blue-500 transition-all"
                                >
                                  <Edit3 size={12} />
                                </button>
                                <button
                                  onClick={() => setDeleteModal({ isOpen: true, taskId: task._id })}
                                  className="p-1 hover:bg-red-50 rounded text-slate-400 hover:text-red-500 transition-all"
                                >
                                  <Trash2 size={12} />
                                </button>
                                <GripVertical size={14} className="text-slate-300" />
                              </div>
                            </div>

                            <h4 className="font-bold text-slate-800 mb-2 leading-tight">{task.title}</h4>
                            {task.description && <p className="text-[11px] text-slate-500 line-clamp-2 mb-4">{task.description}</p>}

                            <div className="flex items-center justify-between pt-4 border-t border-slate-50 mt-4">
                              <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-medium">
                                <Calendar size={12} />
                                {task.dueDate ? format(new Date(task.dueDate), 'MMM dd') : 'No date'}
                              </div>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                    {filteredTasks.filter(t => t.status === col).length === 0 && !provided.placeholder && (
                      <div className="py-20 text-center border-2 border-dashed border-slate-200 rounded-2xl">
                        <p className="text-xs text-slate-400 font-medium tracking-wide">No tasks found</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">{editingTaskId ? 'Edit Task' : 'Create New Task'}</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Task Title</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all placeholder:text-slate-400"
                    placeholder="E.g. Design Landing Page"
                    required
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
                  <textarea
                    rows="3"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all resize-none placeholder:text-slate-400"
                    placeholder="What needs to be done?"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Due Date</label>
                    <input
                      type="date"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                      value={form.dueDate}
                      onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Priority</label>
                    <select
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                      value={form.priority}
                      onChange={(e) => setForm({ ...form, priority: e.target.value })}
                    >
                      <option>Low</option>
                      <option>Medium</option>
                      <option>High</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Status</label>
                    <select
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                      value={form.status}
                      onChange={(e) => setForm({ ...form, status: e.target.value })}
                    >
                      {COLUMNS.map(col => (
                        <option key={col} value={col}>{col}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex gap-3 pt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setEditingTaskId(null);
                    }}
                    className="flex-1 px-4 py-3 border border-slate-200 rounded-xl font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 shadow-lg shadow-primary-200 transition-all active:scale-95"
                  >
                    {editingTaskId ? 'Save Changes' : 'Create Task'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, taskId: null })}
        onConfirm={handleDeleteTask}
        title="Delete Task"
        message="Are you sure you want to delete this task? This action cannot be undone."
        loading={deleteLoading}
      />
    </div>
  );
};

export default ProjectDetails;
