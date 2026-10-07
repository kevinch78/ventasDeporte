import { api } from './api';

export interface CreateOrderPayload {
  nombreCliente: string;
  telefono: string;
  direccion: string;
  ciudad: string;
  metodoEnvio: string;
  metodoPago: string;
  notas?: string;
  items: { productoId: string; cantidad: number }[];
}

export const orderService = {
  createOrder: async (orderData: CreateOrderPayload) => {
    const { data } = await api.post('/pedidos', orderData);
    return data;
  },
  getOrders: async (estado?: string) => {
    const params = estado ? { estado } : {};
    const { data } = await api.get('/admin/pedidos', { params });
    return data;
  },
  getOrderById: async (id: string) => {
    const { data } = await api.get(`/admin/pedidos/${id}`);
    return data;
  },
  updateOrderStatus: async (id: string, estado: string) => {
    const { data } = await api.patch(`/admin/pedidos/${id}/estado`, { estado });
    return data;
  },
};
