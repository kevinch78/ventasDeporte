import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, LogOut, ExternalLink } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

export const AdminLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navItems = [
    { name: 'Pedidos', path: '/admin/pedidos', icon: LayoutDashboard },
    { name: 'Productos', path: '/admin/productos', icon: Package },
  ];

  return (
    <div className="min-h-screen bg-dark-base flex text-gray-200 font-sans">
      
      {/* Sidebar */}
      <aside className="w-64 bg-dark-surface border-r border-dark-border flex flex-col">
        <div className="h-20 flex items-center px-6 border-b border-dark-border">
          <div className="flex items-center gap-2 grayscale">
            <div className="w-6 h-6 bg-white rounded-sm flex items-center justify-center transform -skew-x-12">
              <span className="text-dark-base font-black text-sm italic">V</span>
            </div>
            <span className="text-xl font-black tracking-tighter uppercase text-white">Admin</span>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-semibold ${
                  isActive 
                    ? 'bg-volt/10 text-volt border border-volt/20' 
                    : 'text-gray-400 hover:text-white hover:bg-dark-card border border-transparent'
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-dark-border">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full text-left text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all font-semibold"
          >
            <LogOut className="w-5 h-5" />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="h-20 bg-dark-surface border-b border-dark-border flex items-center justify-between px-8">
          <h2 className="text-xl font-bold text-white capitalize">
            {location.pathname.split('/').pop()}
          </h2>
          <div className="flex items-center gap-6">
            <Link 
              to="/" 
              target="_blank"
              className="text-sm font-semibold text-gray-400 hover:text-volt flex items-center gap-2 transition-colors"
            >
              Ver Tienda <ExternalLink className="w-4 h-4" />
            </Link>
            <div className="flex items-center gap-3 pl-6 border-l border-dark-border">
              <div className="w-8 h-8 rounded-full bg-volt/20 border border-volt flex items-center justify-center text-volt font-bold">
                {user?.name.charAt(0)}
              </div>
              <span className="text-sm font-bold text-white">{user?.name}</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 p-8 overflow-y-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
