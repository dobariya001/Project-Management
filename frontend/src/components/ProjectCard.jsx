import { useNavigate } from 'react-router-dom';

const ProjectCard = ({ project, onDelete, onEdit }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white shadow-md p-4 rounded">
      <h2 className="text-lg font-semibold cursor-pointer" onClick={() => navigate(`/project/${project._id}`)}>
        {project.name}
      </h2>

      <p className="text-gray-500">{project.description}</p>

      <div className="flex justify-between items-center mt-3">
        <span className="text-sm text-blue-600">{project.status}</span>

        <div className="space-x-2">
          <button onClick={() => onEdit(project)} className="bg-yellow-500 text-white px-2 py-1 rounded text-sm">
            Edit
          </button>

          <button onClick={() => onDelete(project._id)} className="bg-red-500 text-white px-2 py-1 rounded text-sm">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
