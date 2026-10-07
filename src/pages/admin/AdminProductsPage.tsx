import React, { useState, useEffect } from 'react';
import type { Product } from '../../types';
import { Plus, Edit2, CheckCircle2, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { productService } from '../../services/productService';

export const AdminProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const defaultFormState = {
    nombre: '',
    slug: '',
    categoria: 'Suplementos' as Product['categoria'],
    precio: 0,
    precioAntes: 0,
    descripcion: '',
    stock: 0,
    badges: '',
    beneficios: '',
    modoUso: '',
    activo: true
  };

  const [formData, setFormData] = useState(defaultFormState);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [specsList, setSpecsList] = useState<{key: string, value: string}[]>([]);

  const fetchProducts = async () => {
    try {
      const data = await productService.getProducts();
      setProducts(data.data);
    } catch (error) {
      toast.error('Error al cargar productos');
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleOpenNew = () => {
    setEditingProduct(null);
    setFormData(defaultFormState);
    setImageFile(null);
    setSpecsList([]);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      ...product,
      precioAntes: product.precioAntes || 0,
      badges: product.badges.join(', '),
      beneficios: product.beneficios ? product.beneficios.join('\n') : '',
      modoUso: product.modoUso || '',
      activo: product.activo ?? true
    } as typeof defaultFormState);
    
    const parsedSpecs = product.especificaciones || {};
    setSpecsList(Object.entries(parsedSpecs).map(([k, v]) => ({ key: k, value: String(v) })));
    
    setImageFile(null);
    setIsModalOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: ['precio', 'precioAntes', 'stock'].includes(name) ? Number(value) : value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const formPayload = new FormData();
      formPayload.append('nombre', formData.nombre);
      formPayload.append('categoria', formData.categoria);
      formPayload.append('precio', formData.precio.toString());
      formPayload.append('descripcion', formData.descripcion);
      formPayload.append('stock', formData.stock.toString());
      
      const parsedBadges = formData.badges.split(',').map(b => b.trim()).filter(Boolean);
      formPayload.append('badges', JSON.stringify(parsedBadges));
      
      const parsedBeneficios = formData.beneficios.split('\n').map(b => b.trim()).filter(Boolean);
      formPayload.append('beneficios', JSON.stringify(parsedBeneficios));
      
      const specsObj = specsList.reduce((acc, curr) => {
        if (curr.key.trim() && curr.value.trim()) {
          acc[curr.key.trim()] = curr.value.trim();
        }
        return acc;
      }, {} as Record<string, string>);
      formPayload.append('especificaciones', JSON.stringify(specsObj));
      
      formPayload.append('modoUso', formData.modoUso);
      formPayload.append('activo', String(formData.activo));

      if (formData.precioAntes > 0) {
        formPayload.append('precioAntes', formData.precioAntes.toString());
      }
      
      if (imageFile) {
        formPayload.append('imagen', imageFile);
      }

      if (editingProduct) {
        await productService.updateProduct(editingProduct.id, formPayload);
        toast.success('Producto actualizado');
      } else {
        await productService.createProduct(formPayload);
        toast.success('Producto creado');
      }
      
      fetchProducts();
      setIsModalOpen(false);
    } catch (error) {
      toast.error('Error al guardar el producto');
      console.error(error);
    }
  };

  const toggleProductActive = async (id: string, activo: boolean) => {
    try {
      await productService.updateProduct(id, { activo: !activo });
      fetchProducts();
    } catch (error) {
      toast.error('Error al actualizar estado');
    }
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
                      onClick={() => toggleProductActive(product.id, product.activo || false)}
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
            
            <form id="product-form" onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/20 [&::-webkit-scrollbar-thumb]:rounded-full">
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-semibold text-gray-400 mb-1">Nombre del Producto</label>
                  <input required type="text" name="nombre" value={formData.nombre} onChange={handleInputChange} className="w-full bg-dark-card border border-white/10 rounded-lg px-4 py-3 focus:border-volt focus:ring-1 focus:ring-volt text-white outline-none" />
                </div>
                
                <div className="flex items-center gap-2 pt-6">
                  <label className="text-sm font-semibold text-gray-400">¿Visible en tienda?</label>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, activo: !prev.activo }))}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${formData.activo ? 'bg-volt' : 'bg-gray-600'}`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.activo ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                <label className="block text-sm font-semibold text-gray-400 mb-1">Imagen</label>
                <div className="flex items-center gap-4">
                  {editingProduct?.imagenUrl && !imageFile && (
                    <div className="w-20 h-20 shrink-0 bg-dark-base rounded-xl overflow-hidden border border-white/10">
                      <img src={editingProduct.imagenUrl} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                  {imageFile && (
                    <div className="w-20 h-20 shrink-0 bg-dark-base rounded-xl overflow-hidden border border-volt/50">
                      <img src={URL.createObjectURL(imageFile)} alt="New Preview" className="w-full h-full object-cover opacity-80" />
                    </div>
                  )}
                  <div className="flex-1">
                    <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} className="w-full bg-dark-card border border-white/10 rounded-lg px-4 py-3 focus:border-volt focus:ring-1 focus:ring-volt text-white outline-none" />
                    {editingProduct && !imageFile && (
                      <p className="text-xs text-gray-500 mt-2">Sube un archivo nuevo para reemplazar la imagen actual.</p>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-1">Badges (Separados por coma)</label>
                <input type="text" name="badges" value={formData.badges} onChange={handleInputChange} className="w-full bg-dark-card border border-white/10 rounded-lg px-4 py-3 focus:border-volt focus:ring-1 focus:ring-volt text-white outline-none" placeholder="Ej: HIGH ENERGY, 25G PROTEIN" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-1">Descripción Corta</label>
                <textarea required name="descripcion" value={formData.descripcion} onChange={handleInputChange} rows={2} className="w-full bg-dark-card border border-white/10 rounded-lg px-4 py-3 focus:border-volt focus:ring-1 focus:ring-volt text-white outline-none resize-none" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-1">Beneficios (Un beneficio por línea)</label>
                <textarea name="beneficios" value={formData.beneficios} onChange={handleInputChange} rows={3} className="w-full bg-dark-card border border-white/10 rounded-lg px-4 py-3 focus:border-volt focus:ring-1 focus:ring-volt text-white outline-none resize-none" placeholder="Apto para veganos&#10;36g Carbohidratos" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-1">Modo de Uso</label>
                <textarea name="modoUso" value={formData.modoUso} onChange={handleInputChange} rows={3} className="w-full bg-dark-card border border-white/10 rounded-lg px-4 py-3 focus:border-volt focus:ring-1 focus:ring-volt text-white outline-none resize-none" placeholder="Disolver 3 cucharadas en una botella..." />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-semibold text-gray-400">Especificaciones Técnicas</label>
                  <button type="button" onClick={() => setSpecsList([...specsList, { key: '', value: '' }])} className="text-xs font-bold text-volt hover:text-white flex items-center gap-1 transition-colors"><Plus className="w-3 h-3" /> Añadir Dato</button>
                </div>
                {specsList.length === 0 && <p className="text-xs text-gray-500 mb-2">No hay especificaciones añadidas.</p>}
                <div className="space-y-2">
                  {specsList.map((spec, idx) => (
                    <div key={idx} className="flex gap-2 items-start">
                      <input type="text" placeholder="Clave (Ej: Uso)" value={spec.key} onChange={(e) => { const newSpecs = [...specsList]; newSpecs[idx].key = e.target.value; setSpecsList(newSpecs); }} className="w-1/3 bg-dark-card border border-white/10 rounded-lg px-3 py-2 text-sm focus:border-volt focus:ring-1 focus:ring-volt text-white outline-none" />
                      <input type="text" placeholder="Valor (Ej: Pre-entreno)" value={spec.value} onChange={(e) => { const newSpecs = [...specsList]; newSpecs[idx].value = e.target.value; setSpecsList(newSpecs); }} className="flex-1 bg-dark-card border border-white/10 rounded-lg px-3 py-2 text-sm focus:border-volt focus:ring-1 focus:ring-volt text-white outline-none" />
                      <button type="button" onClick={() => setSpecsList(specsList.filter((_, i) => i !== idx))} className="p-2 mt-0.5 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"><XCircle className="w-4 h-4" /></button>
                    </div>
                  ))}
                </div>
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
