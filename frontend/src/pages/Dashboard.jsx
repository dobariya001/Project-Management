import { useEffect, useState } from 'react';
import axios from '../api/axios';
import { toast } from 'react-hot-toast';
import {
  FolderKanban,
  CheckSquare,
  ExternalLink,
  Clock
} from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalTasks: 0
  });
  const [recentProjects, setRecentProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const statsRes = await axios.get('/project/stats');
        const projRes = await axios.get('/project/getAll?limit=5');

        if (statsRes.data.status) setStats(statsRes.data.data);
        if (projRes.data.status) setRecentProjects(projRes.data.data);
      } catch (error) {
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const cards = [
    {
      title: 'Total Projects',
      value: stats.totalProjects,
      icon: FolderKanban,
      color: 'bg-blue-500',
      bgLight: 'bg-blue-50',
      textColor: 'text-blue-600',
      onClick: () => navigate('/projects'),
      pointer: 'cursor-pointer'
    },
    {
      title: 'Total Tasks',
      value: stats.totalTasks,
      icon: CheckSquare,
      color: 'bg-purple-500',
      bgLight: 'bg-purple-50',
      textColor: 'text-purple-600'
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
          Welcome back, <span className="text-primary-600">{user?.name}</span>
        </h1>
        <p className="text-slate-500 mt-1">Here's what's happening with your projects today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div
              key={index}
              onClick={card.onClick}
              className={`bg-white p-6 rounded-3xl border border-slate-100  ${card.pointer} shadow-sm hover:shadow-md transition-all duration-300`}
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-2xl ${card.bgLight} ${card.textColor}`}>
                  <Icon size={24} />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">{card.title}</p>
                  {loading ? (
                    <div className="h-8 w-16 bg-slate-100 animate-pulse rounded-lg mt-1" />
                  ) : (
                    <h3 className="text-2xl font-bold text-slate-900">{card.value}</h3>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="pt-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-900">Recent Projects</h2>
          <button onClick={() => navigate('/projects')} className="text-primary-600 text-sm font-bold hover:underline">View All</button>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => <div key={i} className="h-40 bg-white rounded-3xl border border-slate-100 animate-pulse" />)}
          </div>
        ) : recentProjects.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-dashed border-slate-200 text-center">
            <FolderKanban className="mx-auto text-slate-300 mb-4" size={40} />
            <p className="text-slate-500 font-medium">No projects yet. Start by creating one!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentProjects.map((project) => (
              <div
                key={project._id}
                onClick={() => navigate(`/project/${project._id}`)}
                className="group bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${project.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-600'}`}>
                    {project.status}
                  </div>
                  <ExternalLink size={14} className="text-slate-300 group-hover:text-primary-600 transition-colors" />
                </div>
                <h3 className="font-bold text-slate-900 mb-2 truncate group-hover:text-primary-600 transition-colors">{project.name}</h3>
                <div className="flex items-center gap-2 text-slate-400 text-[10px] font-medium mt-4 pt-4 border-t border-slate-50">
                  <Clock size={12} />
                  {format(new Date(project.createdAt), 'MMM dd, yyyy')}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
