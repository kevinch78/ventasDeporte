import React, { useState, useEffect } from 'react';
import { ShoppingCart, Menu, X } from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';
import { Link } from 'react-router-dom';
import { TopAnnouncementBar } from './TopAnnouncementBar';

export const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isBouncing, setIsBouncing] = useState(false);
  
  const { items, toggleCart } = useCartStore();
  const totalItems = items.reduce((acc, item) => acc + item.cantidad, 0);

  useEffect(() => {
    if (totalItems > 0) {
      setIsBouncing(true);
      const timer = setTimeout(() => setIsBouncing(false), 300);
      return () => clearTimeout(timer);
    }
  }, [totalItems]);

  return (
    <>
      <TopAnnouncementBar />
      <nav className="sticky top-0 z-40 w-full bg-dark-base/80 backdrop-blur-md border-b border-dark-border relative">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-volt to-transparent opacity-50" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-volt rounded-sm flex items-center justify-center transform -skew-x-12 group-hover:scale-105 transition-transform">
              <span className="text-volt-contrast font-black text-xl italic">V</span>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black tracking-tighter uppercase text-white leading-none">
                Victoria
              </span>
              <span className="text-[10px] font-bold text-gray-400 tracking-widest uppercase mt-0.5">
                Nutrición, Salud y Deporte
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex space-x-8">
            {['Suplementos', 'Hidratación', 'Accesorios'].map((cat) => (
              <Link
                key={cat}
                to={`/?categoria=${cat}`}
                className="text-sm font-semibold tracking-wide text-gray-400 hover:text-volt transition-colors uppercase"
              >
                {cat}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 md:gap-4">
            <button
              onClick={toggleCart}
              className="relative p-2 text-gray-300 hover:text-volt transition-colors"
            >
              <ShoppingCart className="w-6 h-6 md:w-6 md:h-6" />
              {totalItems > 0 && (
                <span className={`absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-[10px] font-bold text-volt-contrast bg-volt rounded-full transform translate-x-1 -translate-y-1 transition-transform ${isBouncing ? 'scale-125' : 'scale-100'}`}>
                  {totalItems}
                </span>
              )}
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-gray-300 hover:text-volt transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out bg-dark-surface border-b border-dark-border ${isMobileMenuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0 border-transparent'}`}>
        <div className="px-4 py-4 flex flex-col space-y-4">
          <Link 
            to="/" 
            onClick={() => { setIsMobileMenuOpen(false); window.scrollTo(0, 0); }}
            className="text-white font-black tracking-widest uppercase text-sm border-b border-dark-border pb-2"
          >
            Inicio
          </Link>
          {['Suplementos', 'Hidratación', 'Accesorios'].map((cat) => (
            <Link
              key={cat}
              to={`/?categoria=${cat}`}
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-sm font-semibold tracking-wide text-gray-400 hover:text-volt transition-colors uppercase pl-2"
            >
              {cat}
            </Link>
          ))}
          <Link 
            to="/envios" 
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-xs font-semibold tracking-wide text-gray-500 uppercase pt-2 border-t border-dark-border"
          >
            Políticas de Envío
          </Link>
        </div>
      </div>
    </nav>
    </>
  );
};
