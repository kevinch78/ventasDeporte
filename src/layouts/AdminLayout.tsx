import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, LogOut, ExternalLink, Menu, X } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import logoImg from '../assets/img/logoSinFondo.png';

export const AdminLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navItems = [
    { name: 'Pedidos', path: '/admin/pedidos', icon: LayoutDashboard },
    { name: 'Productos', path: '/admin/productos', icon: Package },
  ];

  return (
    <div className="min-h-screen bg-dark-base flex text-gray-200 font-sans overflow-hidden">
      
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-dark-surface border-r border-dark-border flex flex-col transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-20 flex items-center justify-between px-6 border-b border-dark-border">
          <div className="flex items-center gap-2 grayscale hover:grayscale-0 transition-all">
            <img src={logoImg} alt="Victoria Logo" className="h-8 w-auto object-contain" />
            <span className="text-sm font-black tracking-tighter uppercase text-white mt-1">Admin</span>
          </div>
          <button 
            className="md:hidden text-gray-400 hover:text-white"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setIsSidebarOpen(false)}
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
      <main className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-20 bg-dark-surface border-b border-dark-border flex items-center justify-between px-4 md:px-8 shrink-0">
          <div className="flex items-center gap-3">
            <button 
              className="md:hidden p-2 text-gray-400 hover:text-white rounded-lg hover:bg-dark-card"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
            <h2 className="text-lg md:text-xl font-bold text-white capitalize truncate">
              {location.pathname.split('/').pop()}
            </h2>
          </div>
          <div className="flex items-center gap-4 md:gap-6">
            <Link 
              to="/" 
              target="_blank"
              className="hidden sm:flex text-sm font-semibold text-gray-400 hover:text-volt items-center gap-2 transition-colors"
            >
              Ver Tienda <ExternalLink className="w-4 h-4" />
            </Link>
            <div className="flex items-center gap-2 md:gap-3 sm:pl-6 sm:border-l border-dark-border">
              <div className="w-8 h-8 rounded-full bg-volt/20 border border-volt flex items-center justify-center text-volt font-bold">
                {user?.nombre?.charAt(0)}
              </div>
              <span className="text-sm font-bold text-white">{user?.nombre}</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 p-4 md:p-8 overflow-y-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
