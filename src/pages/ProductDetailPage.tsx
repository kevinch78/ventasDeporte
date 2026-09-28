import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAdminStore } from '../store/useAdminStore';
import { useCartStore } from '../store/useCartStore';
import { Navbar } from '../components/layout/Navbar';
import { ProductCard } from '../components/catalog/ProductCard';
import { Plus, Minus, ArrowLeft, Info, Truck } from 'lucide-react';
import { toast } from 'sonner';

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const allProducts = useAdminStore((state) => state.products);
  const product = allProducts.find((p) => p.slug === slug && p.activo !== false);
  
  const addItem = useCartStore((state) => state.addItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const cartItems = useCartStore((state) => state.items);
  const setCartOpen = useCartStore((state) => state.setCartOpen);

  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'info' | 'envios'>('info');

  if (!product) {
    return (
      <div className="min-h-screen bg-dark-base flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <div className="text-volt font-mono font-black text-6xl mb-4">404</div>
          <h1 className="text-2xl font-black text-white uppercase tracking-wider mb-6 text-center">Producto no encontrado</h1>
          <button 
            onClick={() => navigate('/')}
            className="px-6 py-3 border border-dark-border bg-dark-surface hover:bg-dark-card text-gray-300 font-bold uppercase text-sm tracking-widest rounded-xl transition-colors flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Volver al Catálogo
          </button>
        </div>
      </div>
    );
  }

  const relatedProducts = allProducts
    .filter((p) => p.categoria === product.categoria && p.id !== product.id && p.activo !== false)
    .slice(0, 3);

  const cartItem = cartItems.find((i) => i.id === product.id);
  const availableStock = product.stock - (cartItem?.cantidad || 0);

  const handleAdd = () => {
    if (quantity > availableStock) {
      toast.error('Stock insuficiente');
      return;
    }
    
    if (cartItem) {
      updateQuantity(product.id, cartItem.cantidad + quantity);
      toast.success(`${quantity} x ${product.nombre} añadido`);
      setCartOpen(true);
    } else {
      // Temporarily use updateQuantity logic equivalent by multiple adds or we can modify the store
      // Since our add item only adds 1, let's just loop or we could update the store to accept quantity
      // To not break existing code, we'll manually call addItem and then updateQuantity
      addItem(product);
      if (quantity > 1) {
        updateQuantity(product.id, quantity);
      }
    }
  };

  const handleBuyNow = () => {
    if (quantity > availableStock) {
      toast.error('Stock insuficiente');
      return;
    }
    
    if (!cartItem) {
      addItem(product);
      if (quantity > 1) {
        updateQuantity(product.id, quantity);
      }
    } else {
      updateQuantity(product.id, cartItem.cantidad + quantity);
    }
    
    setCartOpen(false);
    navigate('/checkout');
  };

  return (
    <div className="min-h-screen bg-dark-base flex flex-col text-gray-200">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-grow">
        <button 
          onClick={() => navigate(-1)}
          className="text-gray-400 hover:text-white flex items-center gap-2 font-bold uppercase tracking-wider text-xs mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Volver
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
          {/* Image */}
          <div className="relative aspect-square rounded-3xl overflow-hidden bg-dark-surface border border-dark-border group">
            <div className="absolute inset-0 bg-gradient-to-tr from-volt/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
            <img src={product.imagenUrl} alt={product.nombre} className="w-full h-full object-cover p-2 rounded-3xl" />
          </div>

          {/* Details */}
          <div className="flex flex-col justify-center">
            <div className="flex gap-2 mb-4 flex-wrap">
              <span className="bg-dark-card border border-dark-border px-3 py-1 text-xs font-mono font-bold uppercase tracking-widest text-white rounded">
                {product.categoria}
              </span>
              <span className={`px-3 py-1 text-xs font-mono font-bold uppercase tracking-widest rounded border ${availableStock > 0 ? 'bg-volt/10 border-volt/30 text-volt' : 'bg-red-500/10 border-red-500/30 text-red-500'}`}>
                {availableStock > 0 ? 'Stock Disponible' : 'Agotado'}
              </span>
              {product.badges.map((badge, idx) => (
                <span key={idx} className="bg-volt text-dark-base px-3 py-1 text-xs font-mono font-black uppercase tracking-widest rounded">
                  {badge}
                </span>
              ))}
            </div>

            <h1 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter leading-tight mb-4">
              {product.nombre}
            </h1>

            <div className="flex items-end gap-4 mb-8">
              <span className="text-4xl font-black text-volt font-mono">
                ${product.precio.toLocaleString('es-CO')}
              </span>
              {product.precioAntes && (
                <span className="text-lg text-gray-500 line-through font-mono font-bold mb-1">
                  ${product.precioAntes.toLocaleString('es-CO')}
                </span>
              )}
            </div>

            <div className="bg-dark-surface border border-dark-border p-6 rounded-2xl mb-8 space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">Cantidad</label>
                <div className="flex items-center gap-4 bg-dark-base border border-dark-border w-max rounded-xl px-2 py-1">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-volt hover:bg-dark-surface rounded-lg transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="text-lg font-mono font-bold text-white w-8 text-center">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(Math.min(availableStock, quantity + 1))}
                    disabled={quantity >= availableStock}
                    className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-volt hover:bg-dark-surface rounded-lg transition-colors disabled:opacity-30 disabled:hover:text-gray-400 disabled:hover:bg-transparent"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                {availableStock > 0 && availableStock <= 5 && (
                  <p className="text-xs text-amber-500 font-bold mt-2">¡Últimas {availableStock} unidades!</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button 
                  onClick={handleAdd}
                  disabled={availableStock === 0}
                  className="w-full bg-dark-card hover:bg-dark-surface border border-dark-border text-white font-black uppercase tracking-wider py-4 rounded-xl transition-all disabled:opacity-50"
                >
                  Agregar al Carrito
                </button>
                <button 
                  onClick={handleBuyNow}
                  disabled={availableStock === 0}
                  className="w-full bg-volt hover:bg-volt-hover text-volt-contrast font-black uppercase tracking-wider py-4 rounded-xl transition-all glow-hover disabled:opacity-50"
                >
                  Comprar Ahora
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="border border-dark-border rounded-2xl overflow-hidden bg-dark-surface">
              <div className="flex border-b border-dark-border">
                <button 
                  onClick={() => setActiveTab('info')}
                  className={`flex-1 py-4 text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors ${activeTab === 'info' ? 'bg-dark-card text-white' : 'text-gray-500 hover:text-gray-300 hover:bg-dark-card/50'}`}
                >
                  <Info className="w-4 h-4" /> Detalles
                </button>
                <div className="w-px bg-dark-border" />
                <button 
                  onClick={() => setActiveTab('envios')}
                  className={`flex-1 py-4 text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors ${activeTab === 'envios' ? 'bg-dark-card text-white' : 'text-gray-500 hover:text-gray-300 hover:bg-dark-card/50'}`}
                >
                  <Truck className="w-4 h-4" /> Envíos
                </button>
              </div>
              <div className="p-6 bg-dark-card text-sm text-gray-300 leading-relaxed min-h-[150px]">
                {activeTab === 'info' ? (
                  <div className="space-y-4">
                    <p>{product.descripcion}</p>
                    <div>
                      <strong className="text-white">Modo de Uso:</strong>
                      <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-400">
                        <li>Tomar 1 scoop con 250ml de agua o bebida favorita.</li>
                        <li>Consumir preferiblemente post-entrenamiento.</li>
                        <li>No exceder la dosis recomendada.</li>
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 text-gray-400">
                    <p><strong className="text-white">Cobertura:</strong> Hacemos envíos a todo Colombia.</p>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-2">
                        <span className="text-volt font-bold mt-1">⚡</span>
                        <span><strong>Medellín y Área Metropolitana:</strong> Entregas en menos de 24 horas hábiles. Costo fijo: $8.000 COP.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-volt font-bold mt-1">🚚</span>
                        <span><strong>Resto del País:</strong> Despachamos mediante transportadora con pago contra entrega. Tiempo estimado: 48 a 72 horas hábiles.</span>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-24">
            <div className="flex items-center gap-3 mb-8">
              <span className="w-6 h-1 bg-volt block rounded-full" />
              <h2 className="text-2xl font-black uppercase tracking-tight text-white">
                Completa tu Stack
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
