const TaskCard = ({ task, onDelete, onUpdate }) => {
  return (
    <div className="bg-gray-100 p-4 rounded shadow-sm">
      <h3 className="font-semibold">{task.title}</h3>
      <p className="text-sm text-gray-600">{task.description}</p>
      <p className="text-sm">Priority: {task.priority}</p>
      <p className="text-sm">Due: {task.dueDate?.slice(0, 10)}</p>

      <select
        value={task.status}
        onChange={(e) => onUpdate(task._id, { status: e.target.value })}
        className="mt-2 border p-1 rounded"
      >
        <option>Pending</option>
        <option>In Progress</option>
        <option>Done</option>
      </select>

      <button onClick={() => onDelete(task._id)} className="bg-red-500 text-white px-2 py-1 rounded text-sm mt-2">
        Delete
      </button>
    </div>
  );
};

export default TaskCard;
