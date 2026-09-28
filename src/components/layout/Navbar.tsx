import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';
import { Link } from 'react-router-dom';

export const Navbar: React.FC = () => {
  const { items, toggleCart } = useCartStore();
  const totalItems = items.reduce((acc, item) => acc + item.cantidad, 0);

  return (
    <nav className="sticky top-0 z-40 w-full bg-dark-base/80 backdrop-blur-md border-b border-dark-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-volt rounded-sm flex items-center justify-center transform -skew-x-12 group-hover:scale-105 transition-transform">
              <span className="text-volt-contrast font-black text-xl italic">V</span>
            </div>
            <span className="text-2xl font-black tracking-tighter uppercase text-white">
              Volt<span className="text-volt">Fit</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex space-x-8">
            {['Suplementos', 'Hidratación', 'Accesorios'].map((cat) => (
              <a
                key={cat}
                href={`#${cat.toLowerCase()}`}
                className="text-sm font-semibold tracking-wide text-gray-400 hover:text-volt transition-colors uppercase"
              >
                {cat}
              </a>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center">
            <button
              onClick={toggleCart}
              className="relative p-2 text-gray-300 hover:text-volt transition-colors"
            >
              <ShoppingCart className="w-6 h-6" />
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-volt-contrast bg-volt rounded-full transform translate-x-1 -translate-y-1">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
