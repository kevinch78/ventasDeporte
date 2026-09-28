import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Order, Product, OrderStatus } from '../types';
import { products as initialProducts } from '../mock/products';

interface AdminState {
  products: Product[];
  orders: Order[];
  updateOrderStatus: (codigoPedido: string, newStatus: OrderStatus) => void;
  toggleProductActive: (id: string) => void;
  updateProduct: (product: Product) => void;
  addProduct: (product: Omit<Product, 'id'>) => void;
  addOrder: (order: Order) => void;
}

// Generate some mock orders for initialization
const initialOrders: Order[] = [
  {
    codigoPedido: 'PED-111111',
    fecha: '15 de septiembre de 2026, 10:30',
    nombre: 'Juan Pérez',
    telefono: '3001112233',
    ciudad: 'Medellín',
    direccion: 'Calle Falsa 123',
    notas: 'Llamar al llegar',
    tipoEnvio: 'domicilio',
    metodoPago: 'nequi',
    items: [{ ...initialProducts[0], cantidad: 2 }],
    subtotal: 370000,
    costoEnvio: 8000,
    total: 378000,
    estado: 'PENDIENTE'
  },
  {
    codigoPedido: 'PED-222222',
    fecha: '14 de septiembre de 2026, 14:15',
    nombre: 'María Gómez',
    telefono: '3109998877',
    ciudad: 'Bogotá',
    direccion: 'Cra 45 # 67-89',
    notas: '',
    tipoEnvio: 'nacional',
    metodoPago: 'bancolombia',
    items: [{ ...initialProducts[2], cantidad: 1 }, { ...initialProducts[5], cantidad: 1 }],
    subtotal: 173000,
    costoEnvio: 0,
    total: 173000,
    estado: 'EN_PREPARACION'
  },
  {
    codigoPedido: 'PED-333333',
    fecha: '13 de septiembre de 2026, 09:00',
    nombre: 'Carlos López',
    telefono: '3205554433',
    ciudad: 'Cali',
    direccion: 'Av. Siempre Viva 742',
    notas: 'Dejar en portería',
    tipoEnvio: 'nacional',
    metodoPago: 'nequi',
    items: [{ ...initialProducts[4], cantidad: 3 }],
    subtotal: 330000,
    costoEnvio: 0,
    total: 330000,
    estado: 'ENTREGADO'
  }
];

export const useAdminStore = create<AdminState>()(
  persist(
    (set) => ({
      products: initialProducts.map(p => ({ ...p, activo: true })),
      orders: initialOrders,
      
      updateOrderStatus: (codigoPedido, newStatus) => set((state) => ({
        orders: state.orders.map(o => o.codigoPedido === codigoPedido ? { ...o, estado: newStatus } : o)
      })),
      
      toggleProductActive: (id) => set((state) => ({
        products: state.products.map(p => p.id === id ? { ...p, activo: !p.activo } : p)
      })),
      
      updateProduct: (product) => set((state) => ({
        products: state.products.map(p => p.id === product.id ? product : p)
      })),
      
      addProduct: (productInfo) => set((state) => {
        const newProduct: Product = {
          ...productInfo,
          id: Date.now().toString(),
          activo: true
        };
        return { products: [...state.products, newProduct] };
      }),

      addOrder: (order) => set((state) => ({
        orders: [order, ...state.orders]
      }))
    }),
    {
      name: 'athletic-admin-storage',
      version: 2, // Bump version to force rehydration of expanded mock data if we had migrations, but zustand migrate is complex. Instead let's just make sure it loads.
      migrate: (persistedState: any, version: number) => {
        if (version === 0 || version === 1) {
          // If old version, just clear and return default
          return {
            products: initialProducts.map(p => ({ ...p, activo: true })),
            orders: persistedState.orders || initialOrders
          };
        }
        return persistedState;
      }
    }
  )
);
