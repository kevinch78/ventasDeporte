import React, { useState, useEffect } from 'react';
import { orderService } from '../../services/orderService';
import type { OrderStatus } from '../../types';
import { Eye, MessageCircle, X, Download } from 'lucide-react';
import { getImageUrl } from '../../utils/image';
import { toast } from 'sonner';

const STATUS_BADGES: Record<OrderStatus, { bg: string, text: string, label: string }> = {
  PENDIENTE: { bg: 'bg-amber-900/40 border-amber-700', text: 'text-amber-400', label: 'Pendiente' },
  EN_PREPARACION: { bg: 'bg-blue-900/40 border-blue-700', text: 'text-blue-400', label: 'En Preparación' },
  ENVIADO: { bg: 'bg-purple-900/40 border-purple-700', text: 'text-purple-400', label: 'Enviado' },
  ENTREGADO: { bg: 'bg-emerald-900/40 border-emerald-700', text: 'text-emerald-400', label: 'Entregado' },
  CANCELADO: { bg: 'bg-red-900/40 border-red-700', text: 'text-red-400', label: 'Cancelado' }
};

export const AdminOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [filter, setFilter] = useState<OrderStatus | 'TODOS'>('TODOS');
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  const fetchOrders = async () => {
    try {
      const data = await orderService.getOrders();
      setOrders(data);
    } catch (error) {
      console.error(error);
      toast.error('Error cargando pedidos');
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateOrderStatus = async (id: string, estado: string) => {
    try {
      await orderService.updateOrderStatus(id, estado);
      toast.success('Estado actualizado');
      fetchOrders();
      if (selectedOrder && selectedOrder.id === id) {
        setSelectedOrder({ ...selectedOrder, estado });
      }
    } catch (error) {
      toast.error('Error al actualizar estado');
    }
  };

  const filteredOrders = filter === 'TODOS' ? orders : orders.filter(o => o.estado === filter);

  // Metrics
  const totalOrders = orders.length;
  const pendientes = orders.filter(o => o.estado === 'PENDIENTE').length;
  const enPreparacion = orders.filter(o => o.estado === 'EN_PREPARACION').length;
  const entregados = orders.filter(o => o.estado === 'ENTREGADO').length;

  const handleExportCSV = () => {
    if (orders.length === 0) return;
    
    const headers = ['Código', 'Fecha', 'Cliente', 'Teléfono', 'Ciudad', 'Dirección', 'Total (COP)', 'Método de Pago', 'Estado'];
    const rows = orders.map(o => [
      o.codigo,
      `"${o.createdAt}"`,
      `"${o.nombreCliente}"`,
      o.telefono,
      `"${o.ciudad}"`,
      `"${o.direccion}"`,
      o.total,
      o.metodoPago,
      o.estado
    ]);
    
    const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `pedidos_${new Date().toISOString().split('T')[0]}.csv`;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      
      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Pedidos', value: totalOrders, color: 'text-white' },
          { label: 'Pendientes', value: pendientes, color: 'text-amber-400' },
          { label: 'En Preparación', value: enPreparacion, color: 'text-blue-400' },
          { label: 'Entregados', value: entregados, color: 'text-emerald-400' }
        ].map(metric => (
          <div key={metric.label} className="bg-dark-surface border border-dark-border rounded-xl p-5">
            <p className="text-gray-400 text-sm font-semibold mb-1">{metric.label}</p>
            <p className={`text-3xl font-black font-mono ${metric.color}`}>{metric.value}</p>
          </div>
        ))}
      </div>

      {/* Tabs and Export */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={() => setFilter('TODOS')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${filter === 'TODOS' ? 'bg-volt text-volt-contrast' : 'bg-dark-card border border-dark-border text-gray-400 hover:text-white'}`}
          >
            TODOS
          </button>
          {Object.entries(STATUS_BADGES).map(([status, config]) => (
            <button 
              key={status}
              onClick={() => setFilter(status as OrderStatus)}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${filter === status ? 'bg-white text-dark-base' : 'bg-dark-card border border-dark-border text-gray-400 hover:text-white'}`}
            >
              {config.label.toUpperCase()}
            </button>
          ))}
        </div>
        <button
          onClick={handleExportCSV}
          className="flex items-center gap-2 bg-dark-card border border-dark-border hover:border-white hover:text-white text-gray-300 font-bold uppercase text-xs tracking-wider px-4 py-2 rounded-lg transition-colors"
        >
          <Download className="w-4 h-4" /> Exportar a CSV
        </button>
      </div>

      {/* Table */}
      <div className="bg-dark-surface border border-dark-border rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-dark-card border-b border-dark-border text-xs font-semibold text-gray-400 uppercase tracking-wider">
                <th className="p-4">Pedido</th>
                <th className="p-4">Fecha</th>
                <th className="p-4">Cliente</th>
                <th className="p-4">Total</th>
                <th className="p-4">Pago</th>
                <th className="p-4">Estado</th>
                <th className="p-4 text-center">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-border">
              {filteredOrders.map(order => (
                <tr key={order.codigo} className="hover:bg-dark-card/50 transition-colors">
                  <td className="p-4 font-mono font-bold text-white text-sm">{order.codigo}</td>
                  <td className="p-4 text-sm text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="p-4">
                    <p className="text-sm font-bold text-white">{order.nombreCliente}</p>
                    <p className="text-xs text-gray-500 font-mono">{order.telefono}</p>
                  </td>
                  <td className="p-4 font-mono font-bold text-volt">${order.total.toLocaleString('es-CO')}</td>
                  <td className="p-4">
                    <span className="text-xs font-bold bg-dark-card border border-dark-border px-2 py-1 rounded text-gray-300 uppercase">
                      {order.metodoPago}
                    </span>
                  </td>
                  <td className="p-4">
                    <select 
                      value={order.estado}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                      className={`text-xs font-bold px-3 py-1.5 rounded-full border outline-none appearance-none cursor-pointer ${STATUS_BADGES[order.estado as OrderStatus]?.bg} ${STATUS_BADGES[order.estado as OrderStatus]?.text}`}
                    >
                      {Object.entries(STATUS_BADGES).map(([key, config]) => (
                        <option key={key} value={key} className="bg-dark-base text-white">{config.label}</option>
                      ))}
                    </select>
                  </td>
                  <td className="p-4 text-center">
                    <button 
                      onClick={() => setSelectedOrder(order)}
                      className="p-2 bg-dark-card hover:bg-volt/10 hover:text-volt border border-dark-border hover:border-volt/30 rounded-lg text-gray-400 transition-colors inline-flex"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-gray-500 font-semibold uppercase tracking-widest text-sm">
                    No hay pedidos en esta categoría
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-dark-surface border border-dark-border rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
            <div className="p-6 border-b border-dark-border flex justify-between items-center bg-dark-card">
              <div>
                <h3 className="text-xl font-black text-white uppercase tracking-tight">Detalle del Pedido</h3>
                <p className="text-sm font-mono text-gray-400 mt-1">{selectedOrder.codigo}</p>
              </div>
              <div className="flex items-center gap-4">
                <select 
                  value={selectedOrder.estado}
                  onChange={(e) => updateOrderStatus(selectedOrder.id, e.target.value as OrderStatus)}
                  className={`text-xs font-bold px-3 py-1.5 rounded-full border outline-none appearance-none cursor-pointer ${STATUS_BADGES[selectedOrder.estado as OrderStatus]?.bg} ${STATUS_BADGES[selectedOrder.estado as OrderStatus]?.text}`}
                >
                  {Object.entries(STATUS_BADGES).map(([key, config]) => (
                    <option key={key} value={key} className="bg-dark-base text-white">{config.label}</option>
                  ))}
                </select>
                <button onClick={() => setSelectedOrder(null)} className="p-2 text-gray-400 hover:text-white bg-dark-base rounded-full transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-6">
              {/* Cliente y Envío */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Datos del Cliente</h4>
                  <div className="bg-dark-card border border-dark-border p-4 rounded-xl space-y-2">
                    <p className="text-sm text-gray-300"><strong className="text-white">Nombre:</strong> {selectedOrder.nombreCliente}</p>
                    <p className="text-sm text-gray-300"><strong className="text-white">Celular:</strong> {selectedOrder.telefono}</p>
                    <p className="text-sm text-gray-300"><strong className="text-white">Ciudad:</strong> {selectedOrder.ciudad}</p>
                  </div>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Despacho</h4>
                  <div className="bg-dark-card border border-dark-border p-4 rounded-xl space-y-2">
                    <p className="text-sm text-gray-300"><strong className="text-white">Envío:</strong> {selectedOrder.metodoEnvio}</p>
                    <p className="text-sm text-gray-300"><strong className="text-white">Dirección:</strong> {selectedOrder.direccion}</p>
                    <p className="text-sm text-gray-300"><strong className="text-white">Notas:</strong> {selectedOrder.notas || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Items */}
              <div>
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Productos</h4>
                <div className="bg-dark-card border border-dark-border rounded-xl divide-y divide-dark-border">
                  {selectedOrder.detalles?.map((item: any) => (
                    <div key={item.id} className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img src={getImageUrl(item.producto?.imagenUrl || item.producto?.imagen)} alt={item.producto?.nombre || 'Producto'} className="w-12 h-12 rounded-lg border border-white/10 bg-dark-base object-cover" />
                        <div>
                          <p className="text-sm font-bold text-white">{item.producto?.nombre || item.nombre || 'Producto Desconocido'}</p>
                          <p className="text-xs text-gray-400">{item.cantidad} x ${item.precio.toLocaleString('es-CO')}</p>
                        </div>
                      </div>
                      <span className="font-mono font-bold text-white">${(item.precio * item.cantidad).toLocaleString('es-CO')}</span>
                    </div>
                  ))}
                  <div className="p-4 bg-dark-base flex justify-between items-center rounded-b-xl">
                    <span className="font-bold text-white uppercase tracking-wider text-sm">Total</span>
                    <span className="font-black font-mono text-xl text-volt">${selectedOrder.total.toLocaleString('es-CO')}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-dark-border bg-dark-card">
              <a 
                href={`https://wa.me/57${selectedOrder.telefono}?text=Hola%20${selectedOrder.nombreCliente},%20te%20escribimos%20de%20Victoria%20respecto%20a%20tu%20pedido%20${selectedOrder.codigo}`}
                target="_blank"
                rel="noreferrer"
                className="w-full bg-[#25D366] hover:bg-[#20ba5a] text-black font-bold uppercase tracking-wider py-4 rounded-xl flex items-center justify-center gap-2 transition-all"
              >
                <MessageCircle className="w-5 h-5" /> Chat por WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
