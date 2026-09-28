import React, { useState } from 'react';
import { useAdminStore } from '../../store/useAdminStore';
import type { Product } from '../../types';
import { Plus, Edit2, CheckCircle2, XCircle } from 'lucide-react';
import { toast } from 'sonner';

export const AdminProductsPage: React.FC = () => {
  const { products, toggleProductActive, addProduct, updateProduct } = useAdminStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const defaultFormState = {
    nombre: '',
    slug: '',
    categoria: 'Suplementos' as Product['categoria'],
    precio: 0,
    precioAntes: 0,
    descripcion: '',
    imagenUrl: '',
    stock: 0,
    badges: ''
  };

  const [formData, setFormData] = useState(defaultFormState);

  const handleOpenNew = () => {
    setEditingProduct(null);
    setFormData(defaultFormState);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      ...product,
      precioAntes: product.precioAntes || 0,
      badges: product.badges.join(', ')
    });
    setIsModalOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: ['precio', 'precioAntes', 'stock'].includes(name) ? Number(value) : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const payload = {
      ...formData,
      slug: formData.nombre.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      badges: formData.badges.split(',').map(b => b.trim()).filter(Boolean),
      precioAntes: formData.precioAntes > 0 ? formData.precioAntes : undefined
    };

    if (editingProduct) {
      updateProduct({ ...payload, id: editingProduct.id, activo: editingProduct.activo } as Product);
      toast.success('Producto actualizado');
    } else {
      addProduct(payload);
      toast.success('Producto creado');
    }
    
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-white">Inventario de Productos</h3>
        <button 
          onClick={handleOpenNew}
          className="bg-volt hover:bg-volt-hover text-volt-contrast font-black uppercase text-sm tracking-wider px-5 py-2.5 rounded-lg flex items-center gap-2 transition-all glow-hover"
        >
          <Plus className="w-4 h-4" /> Nuevo Producto
        </button>
      </div>

      {/* Table */}
      <div className="bg-dark-surface border border-dark-border rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-dark-card border-b border-dark-border text-xs font-semibold text-gray-400 uppercase tracking-wider">
                <th className="p-4 w-16">Img</th>
                <th className="p-4">Producto</th>
                <th className="p-4">Precio</th>
                <th className="p-4">Stock</th>
                <th className="p-4 text-center">Estado</th>
                <th className="p-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-border">
              {products.map(product => (
                <tr key={product.id} className={`hover:bg-dark-card/50 transition-colors ${!product.activo ? 'opacity-50' : ''}`}>
                  <td className="p-4">
                    <img src={product.imagenUrl} alt={product.nombre} className="w-10 h-10 rounded bg-dark-base object-cover" />
                  </td>
                  <td className="p-4">
                    <p className="text-sm font-bold text-white truncate max-w-xs">{product.nombre}</p>
                    <p className="text-xs text-gray-500">{product.categoria}</p>
                  </td>
                  <td className="p-4 font-mono font-bold text-white">${product.precio.toLocaleString('es-CO')}</td>
                  <td className="p-4">
                    <span className={`text-sm font-bold font-mono px-2 py-1 rounded ${product.stock > 10 ? 'bg-emerald-900/40 text-emerald-400' : 'bg-red-900/40 text-red-400'}`}>
                      {product.stock} und
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <button 
                      onClick={() => toggleProductActive(product.id)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border transition-colors ${
                        product.activo 
                          ? 'bg-volt/10 border-volt/30 text-volt hover:bg-volt/20' 
                          : 'bg-dark-card border-dark-border text-gray-500 hover:text-white'
                      }`}
                    >
                      {product.activo ? <><CheckCircle2 className="w-3 h-3"/> Activo</> : <><XCircle className="w-3 h-3"/> Inactivo</>}
                    </button>
                  </td>
                  <td className="p-4 text-center">
                    <button 
                      onClick={() => handleOpenEdit(product)}
                      className="p-2 bg-dark-card hover:bg-white/10 border border-dark-border hover:border-white/30 rounded-lg text-gray-400 hover:text-white transition-colors inline-flex"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-dark-surface border border-dark-border rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl">
            <div className="p-6 border-b border-dark-border bg-dark-card flex justify-between items-center">
              <h3 className="text-xl font-black text-white uppercase tracking-tight">
                {editingProduct ? 'Editar Producto' : 'Crear Producto'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-gray-400 hover:text-white bg-dark-base rounded-full transition-colors">
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            
            <form id="product-form" onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-1">Nombre del Producto</label>
                <input required type="text" name="nombre" value={formData.nombre} onChange={handleInputChange} className="w-full bg-dark-card border border-white/10 rounded-lg px-4 py-3 focus:border-volt focus:ring-1 focus:ring-volt text-white outline-none" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-400 mb-1">Categoría</label>
                  <select required name="categoria" value={formData.categoria} onChange={handleInputChange} className="w-full bg-dark-card border border-white/10 rounded-lg px-4 py-3 focus:border-volt focus:ring-1 focus:ring-volt text-white outline-none">
                    <option value="Suplementos">Suplementos</option>
                    <option value="Hidratación">Hidratación</option>
                    <option value="Accesorios">Accesorios</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-400 mb-1">Stock</label>
                  <input required type="number" min="0" name="stock" value={formData.stock} onChange={handleInputChange} className="w-full bg-dark-card border border-white/10 rounded-lg px-4 py-3 focus:border-volt focus:ring-1 focus:ring-volt text-white outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-400 mb-1">Precio COP</label>
                  <input required type="number" min="0" name="precio" value={formData.precio} onChange={handleInputChange} className="w-full bg-dark-card border border-white/10 rounded-lg px-4 py-3 focus:border-volt focus:ring-1 focus:ring-volt text-white outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-400 mb-1">Precio Anterior (Opcional)</label>
                  <input type="number" min="0" name="precioAntes" value={formData.precioAntes} onChange={handleInputChange} className="w-full bg-dark-card border border-white/10 rounded-lg px-4 py-3 focus:border-volt focus:ring-1 focus:ring-volt text-white outline-none" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-1">URL de Imagen</label>
                <input required type="url" name="imagenUrl" value={formData.imagenUrl} onChange={handleInputChange} className="w-full bg-dark-card border border-white/10 rounded-lg px-4 py-3 focus:border-volt focus:ring-1 focus:ring-volt text-white outline-none" placeholder="https://..." />
                {formData.imagenUrl && (
                  <div className="mt-2 w-20 h-20 rounded border border-dark-border overflow-hidden">
                    <img src={formData.imagenUrl} alt="Preview" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.style.display = 'none')} />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-1">Badges (Separados por coma)</label>
                <input type="text" name="badges" value={formData.badges} onChange={handleInputChange} className="w-full bg-dark-card border border-white/10 rounded-lg px-4 py-3 focus:border-volt focus:ring-1 focus:ring-volt text-white outline-none" placeholder="Ej: HIGH ENERGY, 25G PROTEIN" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-1">Descripción</label>
                <textarea required name="descripcion" value={formData.descripcion} onChange={handleInputChange} rows={3} className="w-full bg-dark-card border border-white/10 rounded-lg px-4 py-3 focus:border-volt focus:ring-1 focus:ring-volt text-white outline-none resize-none" />
              </div>
            </form>

            <div className="p-6 border-t border-dark-border bg-dark-card">
              <button 
                type="submit" 
                form="product-form"
                className="w-full bg-volt hover:bg-volt-hover text-volt-contrast font-black uppercase tracking-wider py-4 rounded-xl flex items-center justify-center gap-2 transition-all glow-hover"
              >
                {editingProduct ? 'Guardar Cambios' : 'Crear Producto'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
