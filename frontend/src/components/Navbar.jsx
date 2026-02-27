import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="bg-gray-900 text-white p-4 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold">
        Project Manager
      </Link>

      {token && (
        <button onClick={logout} className="bg-red-500 px-4 py-2 rounded hover:bg-red-600">
          Logout
        </button>
      )}
    </nav>
  );
};

export default Navbar;
