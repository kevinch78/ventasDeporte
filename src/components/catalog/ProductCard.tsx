import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { Product } from '../../types';
import { useCartStore } from '../../store/useCartStore';
import { Plus } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, index = 0 }) => {
  const navigate = useNavigate();
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem(product);
  };

  return (
    <div 
      onClick={() => navigate(`/producto/${product.slug}`)}
      className="group relative bg-dark-surface rounded-xl md:rounded-2xl border border-dark-border p-3 md:p-4 hover:border-volt/30 transition-all duration-500 overflow-hidden cursor-pointer flex flex-col h-full animate-fade-in-up active:scale-[0.98] hover:shadow-[0_0_30px_-5px_rgba(204,255,0,0.15)]"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* Background Gradient Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-volt/0 via-dark-surface to-volt/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

      {/* Glow background effect */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-volt opacity-0 group-hover:opacity-[0.03] blur-3xl transition-opacity duration-700 pointer-events-none" />

      {/* Imagen & Badges */}
      <div className="relative aspect-square rounded-lg md:rounded-xl overflow-hidden mb-3 md:mb-4 bg-dark-card border border-dark-border/50 group-hover:border-volt/20 transition-colors shrink-0">
        <img
          src={product.imagenUrl}
          alt={product.nombre}
          className="w-full h-full object-contain p-2 transform group-hover:scale-105 transition-transform duration-700 ease-out"
          loading="lazy"
        />
        <div className="absolute top-2 left-2 flex flex-col gap-1 md:gap-2 z-10">
          {product.badges.map((badge, idx) => (
            <span
              key={idx}
              className="bg-dark-base/80 backdrop-blur-md border border-dark-border px-1.5 py-0.5 md:px-2 md:py-1 text-[9px] md:text-[10px] font-mono font-bold uppercase tracking-widest text-volt rounded shadow-lg"
            >
              {badge}
            </span>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="space-y-2 md:space-y-3 relative z-10 flex flex-col flex-1">
        <div className="flex-1">
          <span className="text-[10px] md:text-xs font-semibold text-gray-500 uppercase tracking-wider">
            {product.categoria}
          </span>
          <h3 className="text-sm md:text-base text-gray-100 font-bold leading-tight mt-0.5 md:mt-1 group-hover:text-white transition-colors line-clamp-2 min-h-[2.5rem]">
            {product.nombre}
          </h3>
        </div>

        <div className="flex items-end justify-between pt-2 border-t border-dark-border/50 shrink-0">
          <div className="flex flex-col">
            {product.precioAntes && (
              <span className="text-[10px] md:text-xs text-gray-500 line-through font-mono">
                ${product.precioAntes.toLocaleString('es-CO')}
              </span>
            )}
            <span className="text-base md:text-xl font-black text-white font-mono leading-none mt-1">
              ${product.precio.toLocaleString('es-CO')}
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-dark-card border border-dark-border flex items-center justify-center text-gray-300 hover:bg-volt hover:text-volt-contrast hover:border-volt transition-all glow-hover group/btn shrink-0 ml-2 active:scale-90"
            aria-label="Añadir al carrito"
          >
            <Plus className="w-4 h-4 md:w-5 md:h-5 transform group-hover/btn:scale-110 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};
